import { GuineaPig } from '@/types/guineaPig';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

interface FloorTimeSession {
  id: string;
  date: string;
  duration: number;
  location: 'floor' | 'garden';
  notes: string;
  success: 'success' | 'neutral' | 'failure';
  pets: string[];
}

const FloorTimeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessions, setSessions] = useState<FloorTimeSession[]>([]);
  const [location, setLocation] = useState<'floor' | 'garden'>('floor');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [editingSession, setEditingSession] = useState<FloorTimeSession | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedSessions, savedPets] = await Promise.all([
        AsyncStorage.getItem('floor_time_sessions'),
        loadPets()
      ]);
      
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
      if (savedPets) {
        setPets(savedPets);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      Alert.alert('Error', 'Failed to load saved data');
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (selectedPets.length === 0) {
      Alert.alert('Error', 'Please select at least one guinea pig');
      return;
    }

    if (isTimerRunning) {
      setIsTimerRunning(false);
      setShowNotes(true);
    } else {
      setElapsedTime(0);
      setIsTimerRunning(true);
      setShowNotes(false);
    }
  };

  const handleSave = async () => {
    if (elapsedTime === 0) {
      Alert.alert('Error', 'Please start the timer first');
      return;
    }

    if (selectedPets.length === 0) {
      Alert.alert('Error', 'Please select at least one guinea pig');
      return;
    }

    try {
      const newSession: FloorTimeSession = {
        id: Date.now().toString(),
        date: new Date(selectedDate).toISOString(),
        duration: elapsedTime,
        location,
        notes: notes.trim(),
        success: 'neutral',
        pets: selectedPets
      };

      const updatedSessions = [newSession, ...sessions];
      await AsyncStorage.setItem('floor_time_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setElapsedTime(0);
      setNotes('');
      setShowNotes(false);
      setIsTimerRunning(false);
      setSelectedPets([]);
    } catch (err) {
      console.error('Failed to save session:', err);
      Alert.alert('Error', 'Failed to save session');
    }
  };

  const handlePetSelect = (petId: string) => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(prev => prev.filter(id => id !== petId));
    } else {
      setSelectedPets(prev => [...prev, petId]);
    }
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } } = {};
    sessions.forEach(session => {
      const date = new Date(session.date).toISOString().split('T')[0];
      marked[date] = {
        marked: true,
        dotColor: colors.primary.DEFAULT
      };
    });
    // Add the selected date
    if (marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary.light
      };
    } else {
      marked[selectedDate] = {
        marked: false,
        dotColor: colors.primary.DEFAULT,
        selected: true,
        selectedColor: colors.primary.light
      };
    }
    return marked;
  };

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => 
      new Date(session.date).toISOString().split('T')[0] === date
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedSessions = sessions.filter(session => session.id !== sessionId);
              await AsyncStorage.setItem('floor_time_sessions', JSON.stringify(updatedSessions));
              setSessions(updatedSessions);
            } catch (err) {
              console.error('Failed to delete session:', err);
              Alert.alert('Error', 'Failed to delete session');
            }
          }
        }
      ]
    );
  };

  const handleEditSession = async (session: FloorTimeSession) => {
    setEditingSession(session);
    setNotes(session.notes || '');
    setLocation(session.location);
    setSelectedPets(session.pets);
    setElapsedTime(session.duration);
    setShowNotes(true);
  };

  const handleUpdateSession = async () => {
    if (!editingSession) return;

    try {
      const updatedSession: FloorTimeSession = {
        ...editingSession,
        duration: elapsedTime,
        location,
        notes: notes.trim(),
        pets: selectedPets
      };

      const updatedSessions = sessions.map(session => 
        session.id === editingSession.id ? updatedSession : session
      );
      
      await AsyncStorage.setItem('floor_time_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setEditingSession(null);
      setNotes('');
      setShowNotes(false);
      setElapsedTime(0);
      setSelectedPets([]);
    } catch (err) {
      console.error('Failed to update session:', err);
      Alert.alert('Error', 'Failed to update session');
    }
  };

  const renderSessions = () => {
    const dateSessions = getSessionsForDate(selectedDate);
    if (dateSessions.length === 0) return null;

    return (
      <View style={styles.sessionsContainer}>
        <Text style={styles.sessionsTitle}>Sessions for {new Date(selectedDate).toLocaleDateString()}</Text>
        {dateSessions.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionInfo}>
                <MaterialIcons 
                  name={session.location === 'floor' ? 'home' : 'grass'} 
                  size={24} 
                  color={colors.primary.DEFAULT} 
                />
                <Text style={styles.sessionDuration}>
                  {formatDuration(session.duration)}
                </Text>
              </View>
              <View style={styles.sessionActions}>
                <Text style={styles.sessionTime}>
                  {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditSession(session)}
                >
                  <MaterialIcons name="edit" size={20} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSession(session.id)}
                >
                  <MaterialIcons name="delete-outline" size={20} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            </View>
            {session.notes && (
              <Text style={styles.sessionNotes}>{session.notes}</Text>
            )}
            <View style={styles.sessionPets}>
              {session.pets.map(petId => {
                const pet = pets.find(p => p.id === petId);
                return pet ? (
                  <Text key={petId} style={styles.petTag}>{pet.name}</Text>
                ) : null;
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPetSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Guinea Pigs</Text>
      <View style={styles.petList}>
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No guinea pigs found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add guinea pigs from the "My Guinea Pigs" screen first
            </Text>
            <TouchableOpacity
              style={styles.addPetButton}
              onPress={() => router.push('/(stack)/my-guinea-pigs')}
            >
              <Text style={styles.addPetButtonText}>Go to My Guinea Pigs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map(pet => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petCard,
                selectedPets.includes(pet.id) && styles.selectedPetCard,
              ]}
              onPress={() => handlePetSelect(pet.id)}
              activeOpacity={0.7}
            >
              <View style={styles.petCardContent}>
                <Text style={[
                  styles.petName,
                  selectedPets.includes(pet.id) && styles.selectedPetName
                ]}>
                  {pet.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );

  const renderTimer = () => (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      <TouchableOpacity
        style={[styles.timerButton, isTimerRunning ? styles.stopButton : styles.startButton]}
        onPress={handleStartStop}
      >
        <Text style={styles.timerButtonText}>
          {isTimerRunning ? 'Stop' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocationSelector = () => (
    <View style={styles.locationContainer}>
      <TouchableOpacity
        style={[
          styles.locationButton,
          location === 'floor' && styles.locationButtonSelected
        ]}
        onPress={() => setLocation('floor')}
      >
        <MaterialIcons name="home" size={24} color={location === 'floor' ? colors.white : colors.text.primary} />
        <Text style={[styles.locationText, location === 'floor' && styles.locationTextSelected]}>
          Floor Time
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.locationButton,
          location === 'garden' && styles.locationButtonSelected
        ]}
        onPress={() => setLocation('garden')}
      >
        <MaterialIcons name="grass" size={24} color={location === 'garden' ? colors.white : colors.text.primary} />
        <Text style={[styles.locationText, location === 'garden' && styles.locationTextSelected]}>
          Garden Time
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <PaperProvider>
      <KeyboardAvoidingView 
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Text style={styles.title}>Playtime & Exercise</Text>
          <TouchableOpacity
            style={styles.logButton}
            onPress={() => router.push('/(stack)/floor-time-logs')}
          >
            <View style={styles.logButtonContent}>
              <MaterialIcons name="history" size={24} color={colors.primary.DEFAULT} />
              <Text style={styles.logButtonText}>View Logs</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={day => {
                setSelectedDate(day.dateString);
                setShowSessions(true);
              }}
              markedDates={getMarkedDates()}
              theme={{
                selectedDayBackgroundColor: colors.primary.DEFAULT,
                todayTextColor: colors.primary.DEFAULT,
                arrowColor: colors.primary.DEFAULT,
                dotColor: colors.primary.DEFAULT,
                selectedDotColor: colors.white,
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
              }}
            />
          </View>

          {showSessions && renderSessions()}
          {renderPetSelection()}
          {renderLocationSelector()}
          {renderTimer()}
          {showNotes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about the session..."
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingSession ? handleUpdateSession : handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {editingSession ? 'Update Session' : 'Save Session'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
    backgroundColor: colors.background.card,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16
  },
  scrollContent: {
    paddingBottom: 16
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  petList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  petCard: {
    backgroundColor: colors.background.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    width: '48%',
    marginBottom: 8,
  },
  selectedPetCard: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petName: {
    color: colors.text.primary,
    fontSize: 16,
    flex: 1,
  },
  selectedPetName: {
    color: colors.white,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  addPetButton: {
    backgroundColor: colors.primary.DEFAULT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPetButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background.card,
    marginHorizontal: 4,
  },
  locationButtonSelected: {
    backgroundColor: colors.primary.DEFAULT,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  locationTextSelected: {
    color: colors.white,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  timerButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.buttons.green,
  },
  stopButton: {
    backgroundColor: colors.buttons.red,
  },
  timerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  notesInput: {
    marginBottom: 16,
    backgroundColor: colors.white,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 100,
    borderColor: colors.primary.DEFAULT,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: colors.primary.DEFAULT,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  sessionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sessionTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sessionNotes: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
  },
  sessionPets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  petTag: {
    backgroundColor: colors.primary.light,
    color: colors.primary.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  logButton: {
    padding: 8,
    marginRight: -8,
  },
  logButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logButtonText: {
    color: colors.primary.DEFAULT,
    fontSize: 16,
    fontWeight: '500',
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default FloorTimeScreen; 