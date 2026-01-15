import BaseScreen from '@/components/BaseScreen';
import { GuineaPig, Mood, MoodEntry, RootStackParamList } from '@/navigation/types';
import { getColor } from '@/theme/colors';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type Props = NativeStackScreenProps<RootStackParamList, 'mood-tracker'>;

const MOODS: Record<Mood, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  happy: { icon: 'sentiment-very-satisfied', color: getColor.success(), label: 'Happy' },
  content: { icon: 'sentiment-satisfied', color: getColor.buttonGreen(), label: 'Content' },
  neutral: { icon: 'sentiment-neutral', color: getColor.buttonOrange(), label: 'Neutral' },
  anxious: { icon: 'sentiment-dissatisfied', color: getColor.warning(), label: 'Anxious' },
  sad: { icon: 'sentiment-very-dissatisfied', color: getColor.error(), label: 'Sad' }
};

const ACTIVITIES: Array<{
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}> = [
  { id: 'eating', label: 'Eating Well', icon: 'restaurant' },
  { id: 'playing', label: 'Playing', icon: 'toys' },
  { id: 'sleeping', label: 'Sleeping', icon: 'bedtime' },
  { id: 'grooming', label: 'Grooming', icon: 'brush' },
  { id: 'socializing', label: 'Socializing', icon: 'groups' },
  { id: 'exploring', label: 'Exploring', icon: 'explore' }
];

const MoodTrackerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { petId } = route.params;
  const [pet, setPet] = useState<GuineaPig | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async (): Promise<void> => {
    try {
      const pets = await loadPets();
      const currentPet = pets.find(p => p.id === petId);
      if (!currentPet) {
        Alert.alert('Error', 'Pet not found');
        navigation.goBack();
        return;
      }
      setPet(currentPet as GuineaPig);
      if (currentPet.moodHistory) {
        setMoodHistory((currentPet.moodHistory as MoodEntry[]) || []);
      }
    } catch {
      Alert.alert('Error', 'Failed to load pet data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivity = (activityId: string): void => {
    if (isEditing && editingEntry) {
      setEditingEntry({
        ...editingEntry,
        activities: editingEntry.activities.includes(activityId)
          ? editingEntry.activities.filter(id => id !== activityId)
          : [...editingEntry.activities, activityId]
      });
    } else {
      setSelectedActivities(prev =>
        prev.includes(activityId)
          ? prev.filter(id => id !== activityId)
          : [...prev, activityId]
      );
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!selectedMood || !pet) {
      Alert.alert('Select Mood', 'Please select a mood before saving.');
      return;
    }

    try {
      const moodEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood,
        activities: selectedActivities
      };

      const pets = await loadPets();
      const updatedPet = pets.find(p => p.id === petId);
      
      if (updatedPet) {
        updatedPet.moodHistory = [
          ...(updatedPet.moodHistory || []),
          moodEntry
        ];
        await savePets(pets);
        setMoodHistory((updatedPet.moodHistory as MoodEntry[]) || []);
        Alert.alert('Success', 'Mood entry saved successfully!');
        navigation.goBack();
      }
    } catch {
      Alert.alert('Error', 'Failed to save mood entry. Please try again.');
    }
  };

  const handleEditEntry = (entry: MoodEntry): void => {
    setEditingEntry(entry);
    setIsEditing(true);
    setSelectedEntry(null);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingEntry || !editingEntry.mood) {
      Alert.alert('Error', 'Please select a mood before saving.');
      return;
    }

    try {
      const pets = await loadPets();
      const updatedPet = pets.find(p => p.id === petId);
      
      if (updatedPet && updatedPet.moodHistory) {
        const updatedHistory = updatedPet.moodHistory.map(entry =>
          entry.id === editingEntry.id ? editingEntry : entry
        );
        updatedPet.moodHistory = updatedHistory;
        await savePets(pets);
        setMoodHistory(updatedHistory);
        setEditingEntry(null);
        setIsEditing(false);
        Alert.alert('Success', 'Mood entry updated successfully!');
      }
    } catch {
      Alert.alert('Error', 'Failed to update mood entry. Please try again.');
    }
  };

  const handleDeleteEntry = (entryId: string): void => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this mood entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const pets = await loadPets();
              const updatedPet = pets.find(p => p.id === petId);
              
              if (updatedPet && updatedPet.moodHistory) {
                const updatedHistory = updatedPet.moodHistory.filter(entry => entry.id !== entryId);
                updatedPet.moodHistory = updatedHistory;
                await savePets(pets);
                setMoodHistory(updatedHistory);
                setSelectedEntry(null);
                Alert.alert('Success', 'Mood entry deleted successfully!');
              }
            } catch {
              Alert.alert('Error', 'Failed to delete mood entry. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCancelEdit = (): void => {
    setEditingEntry(null);
    setIsEditing(false);
  };

  const getMarkedDates = (): Record<string, { marked: boolean; dotColor: string }> => {
    const markedDates: Record<string, { marked: boolean; dotColor: string }> = {};
    moodHistory.forEach(entry => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      const mood = MOODS[entry.mood as keyof typeof MOODS];
      if (date) {
        markedDates[date] = {
          marked: true,
          dotColor: mood.color
        };
      }
    });
    return markedDates;
  };

  const handleDayPress = (day: DateData): void => {
    const entry = moodHistory.find(e => 
      new Date(e.date).toISOString().split('T')[0] === day.dateString
    );
    if (entry) {
      setSelectedEntry(entry);
      setIsEditing(false);
      setEditingEntry(null);
    }
  };

  const renderEntryDetails = (): JSX.Element | null => {
    if (!selectedEntry && !editingEntry) return null;

    const entry = editingEntry || selectedEntry;
    if (!entry) return null;

    const mood = MOODS[entry.mood as keyof typeof MOODS];
    const entryDate = new Date(entry.date).toLocaleDateString();
    const entryActivities = ACTIVITIES.filter(a => entry.activities.includes(a.id));

    return (
      <View style={styles.entryDetails}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>{entryDate}</Text>
          {!isEditing && (
            <View style={styles.entryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditEntry(entry)}
              >
                <MaterialIcons name="edit" size={20} color={getColor.primary()} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteEntry(entry.id)}
              >
                <MaterialIcons name="delete" size={20} color={getColor.error()} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isEditing ? (
          <View>
            <Text style={styles.sectionTitle}>Edit Mood</Text>
            <View style={styles.moodGrid}>
              {Object.entries(MOODS).map(([key, moodOption]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.moodOption,
                    editingEntry?.mood === key && styles.selectedMood
                  ]}
                  onPress={() => editingEntry && setEditingEntry({ ...editingEntry, mood: key as Mood })}
                >
                  <MaterialIcons 
                    name={moodOption.icon} 
                    size={32} 
                    color={editingEntry?.mood === key ? getColor.white() : moodOption.color} 
                  />
                  <Text style={[
                    styles.moodOptionText,
                    editingEntry?.mood === key && styles.selectedMoodText
                  ]}>
                    {moodOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Edit Activities</Text>
            <View style={styles.activitiesGrid}>
              {ACTIVITIES.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityOption,
                    editingEntry?.activities.includes(activity.id) && styles.selectedActivity
                  ]}
                  onPress={() => toggleActivity(activity.id)}
                >
                  <MaterialIcons 
                    name={activity.icon} 
                    size={24} 
                    color={editingEntry?.activities.includes(activity.id) ? getColor.white() : getColor.primary()} 
                  />
                  <Text style={[
                    styles.activityOptionText,
                    editingEntry?.activities.includes(activity.id) && styles.selectedActivityText
                  ]}>
                    {activity.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.editButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveEditButton} onPress={handleSaveEdit}>
                <Text style={styles.saveEditButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.entryMood}>
              <MaterialIcons name={mood.icon} size={32} color={mood.color} />
              <Text style={[styles.entryMoodText, { color: mood.color }]}>{mood.label}</Text>
            </View>
            {entryActivities.length > 0 && (
              <View style={styles.entryActivities}>
                <Text style={styles.entryActivitiesTitle}>Activities:</Text>
                {entryActivities.map(activity => (
                  <View key={activity.id} style={styles.entryActivity}>
                    <MaterialIcons name={activity.icon} size={20} color={getColor.primary()} />
                    <Text style={styles.entryActivityText}>{activity.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (isLoading || !pet) {
    return (
      <BaseScreen title="Loading...">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={getColor.primary()} />
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title={`${pet.name}'s Mood Tracker`}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Track {pet.name}'s Mood</Text>
          <Text style={styles.subtitle}>Select today's mood and activities</Text>
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How is {pet.name} feeling today?</Text>
          <View style={styles.moodGrid}>
            {Object.entries(MOODS).map(([key, mood]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.moodOption,
                  selectedMood === key && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(key as Mood)}
              >
                <MaterialIcons 
                  name={mood.icon} 
                  size={32} 
                  color={selectedMood === key ? getColor.white() : mood.color} 
                />
                <Text style={[
                  styles.moodOptionText,
                  selectedMood === key && styles.selectedMoodText
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>What activities did {pet.name} do?</Text>
          <View style={styles.activitiesGrid}>
            {ACTIVITIES.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityOption,
                  selectedActivities.includes(activity.id) && styles.selectedActivity
                ]}
                onPress={() => toggleActivity(activity.id)}
              >
                <MaterialIcons 
                  name={activity.icon} 
                  size={24} 
                  color={selectedActivities.includes(activity.id) ? getColor.white() : getColor.primary()} 
                />
                <Text style={[
                  styles.activityOptionText,
                  selectedActivities.includes(activity.id) && styles.selectedActivityText
                ]}>
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Mood Entry</Text>
        </TouchableOpacity>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Mood History</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              theme={{
                backgroundColor: getColor.white(),
                calendarBackground: getColor.white(),
                textSectionTitleColor: getColor.text(),
                selectedDayBackgroundColor: getColor.primary(),
                selectedDayTextColor: getColor.white(),
                todayTextColor: getColor.primary(),
                dayTextColor: getColor.text(),
                textDisabledColor: getColor.textSecondary(),
                dotColor: getColor.primary(),
                selectedDotColor: getColor.white(),
                arrowColor: getColor.primary(),
                monthTextColor: getColor.text(),
                textMonthFontWeight: 'bold',
                textDayHeaderFontSize: 13
              }}
            />
          </View>
          {renderEntryDetails()}
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: getColor.white(),
    margin: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: getColor.textSecondary(),
  },
  moodSection: {
    backgroundColor: getColor.white(),
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedMood: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  moodOptionText: {
    fontSize: 12,
    color: getColor.text(),
    marginTop: 8,
    textAlign: 'center',
  },
  selectedMoodText: {
    color: getColor.white(),
  },
  activitiesSection: {
    backgroundColor: getColor.white(),
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityOption: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedActivity: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  activityOptionText: {
    fontSize: 12,
    color: getColor.text(),
    marginTop: 4,
    textAlign: 'center',
  },
  selectedActivityText: {
    color: getColor.white(),
  },
  saveButton: {
    backgroundColor: getColor.primary(),
    margin: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: getColor.white(),
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: getColor.white(),
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  entryDetails: {
    backgroundColor: getColor.backgroundLight(),
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: getColor.white(),
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryMoodText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  entryActivities: {
    marginBottom: 12,
  },
  entryActivitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  entryActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryActivityText: {
    fontSize: 14,
    color: getColor.text(),
    marginLeft: 8,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: getColor.background(),
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: getColor.text(),
    fontSize: 14,
    fontWeight: '600',
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: getColor.primary(),
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveEditButtonText: {
    color: getColor.white(),
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen; 