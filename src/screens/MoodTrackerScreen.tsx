import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MoodRecord {
  id: string;
  date: string;
  mood: string;
  notes?: string;
  activities?: string[];
}

const MoodTrackerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MoodRecord>>({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    notes: '',
    activities: []
  });

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: 'sentiment-satisfied', color: '#4CAF50' },
    { value: 'excited', label: 'Excited', icon: 'sentiment-very-satisfied', color: '#FF9800' },
    { value: 'calm', label: 'Calm', icon: 'sentiment-satisfied-alt', color: '#2196F3' },
    { value: 'curious', label: 'Curious', icon: 'psychology', color: '#9C27B0' },
    { value: 'sleepy', label: 'Sleepy', icon: 'bedtime', color: '#607D8B' },
    { value: 'anxious', label: 'Anxious', icon: 'sentiment-dissatisfied', color: '#FF5722' },
    { value: 'sick', label: 'Sick', icon: 'sick', color: '#F44336' }
  ];

  const activityOptions = [
    'Floor time', 'Cuddles', 'Treats', 'Hay', 'Veggies', 'Play time', 'Grooming', 'Vet visit'
  ];

  const handleAddRecord = (): void => {
    if (newRecord.mood) {
      const record: MoodRecord = {
        id: Date.now().toString(),
        date: newRecord.date || new Date().toISOString().split('T')[0],
        mood: newRecord.mood,
        notes: newRecord.notes,
        activities: newRecord.activities || []
      };
      setRecords([...records, record]);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        mood: '',
        notes: '',
        activities: []
      });
      setIsAddingRecord(false);
    } else {
      Alert.alert('Error', 'Please select a mood');
    }
  };

  const toggleActivity = (activity: string): void => {
    const currentActivities = newRecord.activities || [];
    const updatedActivities = currentActivities.includes(activity)
      ? currentActivities.filter(a => a !== activity)
      : [...currentActivities, activity];
    setNewRecord({ ...newRecord, activities: updatedActivities });
  };

  const getMoodIcon = (mood: string): string => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption?.icon || 'sentiment-neutral';
  };

  const getMoodColor = (mood: string): string => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption?.color || getColor.textSecondary();
  };

  const renderRecord = ({ item }: { item: MoodRecord }): JSX.Element => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <View style={styles.moodIndicator}>
          <MaterialIcons 
            name={getMoodIcon(item.mood) as keyof typeof MaterialIcons.glyphMap} 
            size={24} 
            color={getMoodColor(item.mood)} 
          />
        </View>
      </View>
      <Text style={styles.moodLabel}>
        {moodOptions.find(m => m.value === item.mood)?.label || item.mood}
      </Text>
      {item.activities && item.activities.length > 0 && (
        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesLabel}>Activities:</Text>
          <View style={styles.activitiesList}>
            {item.activities.map((activity) => (
              <View key={`activity-${item.id}-${activity.replace(/\s+/g, '-').toLowerCase()}`} style={styles.activityTag}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {item.notes && (
        <Text style={styles.recordNotes}>{item.notes}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Mood Tracker" />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Mood History</Text>
          <Text style={styles.subtitle}>Track your pet's daily mood and activities</Text>
        </View>

        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="sentiment-neutral" size={48} color={getColor.textSecondary()} />
              <Text style={styles.emptyText}>No mood records yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add a mood record
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingRecord(true)}
        >
          <MaterialIcons name="add" size={24} color={getColor.white()} />
        </TouchableOpacity>

        <Modal
          visible={isAddingRecord}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAddingRecord(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Mood Record</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsAddingRecord(false)}
                >
                  <MaterialIcons name="close" size={24} color={getColor.text()} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={newRecord.date}
                  onChangeText={(text) => setNewRecord({ ...newRecord, date: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Mood *</Text>
                <View style={styles.moodGrid}>
                  {moodOptions.map((mood) => (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodOption,
                        newRecord.mood === mood.value && styles.selectedMood
                      ]}
                      onPress={() => setNewRecord({ ...newRecord, mood: mood.value })}
                    >
                      <MaterialIcons 
                        name={mood.icon as keyof typeof MaterialIcons.glyphMap} 
                        size={24} 
                        color={newRecord.mood === mood.value ? getColor.white() : mood.color} 
                      />
                      <Text style={[
                        styles.moodOptionText,
                        newRecord.mood === mood.value && styles.selectedMoodText
                      ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Activities</Text>
                <View style={styles.activitiesGrid}>
                  {activityOptions.map((activity) => (
                    <TouchableOpacity
                      key={activity}
                      style={[
                        styles.activityOption,
                        (newRecord.activities || []).includes(activity) && styles.selectedActivity
                      ]}
                      onPress={() => toggleActivity(activity)}
                    >
                      <Text style={[
                        styles.activityOptionText,
                        (newRecord.activities || []).includes(activity) && styles.selectedActivityText
                      ]}>
                        {activity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newRecord.notes}
                  onChangeText={(text) => setNewRecord({ ...newRecord, notes: text })}
                  placeholder="Any additional notes about the mood or day"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddingRecord(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddRecord}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
    padding: 12,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: getColor.white(),
    marginBottom: 16,
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
  listContent: {
    padding: 12,
  },
  recordCard: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    color: getColor.textSecondary(),
  },
  moodIndicator: {
    padding: 4,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  activitiesContainer: {
    marginBottom: 8,
  },
  activitiesLabel: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 4,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityTag: {
    backgroundColor: getColor.backgroundLight(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityText: {
    fontSize: 12,
    color: getColor.textSecondary(),
  },
  recordNotes: {
    fontSize: 14,
    color: getColor.textSecondary(),
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  emptySubtext: {
    fontSize: 14,
    color: getColor.textSecondary(),
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: getColor.primary(),
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.overlay(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: getColor.white(),
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: getColor.text(),
    marginBottom: 8,
  },
  input: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: getColor.text(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
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
  selectedMood: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  moodOptionText: {
    fontSize: 12,
    color: getColor.text(),
    marginTop: 4,
    textAlign: 'center',
  },
  selectedMoodText: {
    color: getColor.white(),
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityOption: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    fontSize: 14,
    color: getColor.text(),
  },
  selectedActivityText: {
    color: getColor.white(),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  saveButton: {
    backgroundColor: getColor.primary(),
  },
  cancelButtonText: {
    color: getColor.text(),
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: getColor.white(),
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen; 