import { GuineaPig } from '@/types/guineaPig';
import { showInterstitialAd } from '@/utils/ads';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../theme/colors';

interface FloorTimeSession {
  id: string;
  date: string;
  duration: number;
  location: 'floor' | 'garden';
  notes: string;
  success: 'success' | 'neutral' | 'failure';
  pets: string[];
}

const FloorTimeScreen = (): JSX.Element => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<FloorTimeSession[]>([]);
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [location, setLocation] = useState<'floor' | 'garden'>('floor');
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<FloorTimeSession | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const [sessionsData, petsData] = await Promise.all([
        AsyncStorage.getItem('floorTimeSessions'),
        AsyncStorage.getItem('pets')
      ]);
      
      if (sessionsData) {
        setSessions(JSON.parse(sessionsData));
      }
      if (petsData) {
        setPets(JSON.parse(petsData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = (): void => {
    if (isRunning) {
      stopTimer();
      setShowNotes(true);
    } else {
      if (selectedPets.length === 0) {
        Alert.alert('Error', 'Please select at least one pet to start the session');
        return;
      }
      startTimer();
    }
  };

  const handleSave = async (): Promise<void> => {
    if (timer === 0) {
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
        duration: timer,
        location,
        notes: notes.trim(),
        success: 'neutral',
        pets: selectedPets
      };

      const updatedSessions = [newSession, ...sessions];
      await AsyncStorage.setItem('floor_time_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setTimer(0);
      setNotes('');
      setShowNotes(false);
      setIsRunning(false);
      setSelectedPets([]);
      
      // Show ad when saving a floor time session
      try {
        await showInterstitialAd();
      } catch (adError) {
        console.warn('Failed to show interstitial ad:', adError);
        // Don't fail the session save if ad fails
      }
    } catch (err) {
      console.error('Failed to save session:', err);
      Alert.alert('Error', 'Failed to save session');
    }
  };

  const handlePetSelect = (petId: string): void => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(prev => prev.filter(id => id !== petId));
    } else {
      setSelectedPets(prev => [...prev, petId]);
    }
  };

  const getMarkedDates = (): { [date: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } } => {
    const marked: { [date: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } } = {};
    
    sessions.forEach(session => {
        const date = new Date(session.date).toISOString().split('T')[0];
        marked[date] = {
            marked: true,
            dotColor: getColor.primary(),
            selected: date === selectedDate,
            selectedColor: getColor.primaryLight()
        };
    });

    return marked;
  };

  const getSessionsForDate = (date: string): FloorTimeSession[] => {
    return sessions.filter(session => 
        new Date(session.date).toISOString().split('T')[0] === date
    );
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleDeleteSession = async (sessionId: string): Promise<void> => {
    try {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        await AsyncStorage.setItem('floorTimeSessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
    } catch (error) {
        console.error('Failed to delete session:', error);
        Alert.alert('Error', 'Failed to delete session');
    }
  };

  const handleEditSession = (session: FloorTimeSession): void => {
    setEditingSession(session);
    setSelectedDate(new Date(session.date).toISOString().split('T')[0]);
    setLocation(session.location);
    setSelectedPets(session.pets);
    setTimer(session.duration);
    setNotes(session.notes);
    setShowNotes(true);
  };

  const handleUpdateSession = async (): Promise<void> => {
    if (!editingSession) return;

    try {
        const updatedSession: FloorTimeSession = {
            ...editingSession,
            date: new Date(selectedDate).toISOString(),
            duration: timer,
            location,
            notes: notes.trim(),
            pets: selectedPets
        };

        const updatedSessions = sessions.map(s => 
            s.id === editingSession.id ? updatedSession : s
        );

        await AsyncStorage.setItem('floorTimeSessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        setEditingSession(null);
        setNotes('');
        setShowNotes(false);
        setTimer(0);
        setSelectedPets([]);
    } catch (error) {
        console.error('Failed to update session:', error);
        Alert.alert('Error', 'Failed to update session');
    }
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTimer(0);
  };

  const renderSessions = (): JSX.Element | null => {
    const dateSessions = getSessionsForDate(selectedDate);
    if (dateSessions.length === 0) return null;

    return (
        <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>Sessions</Text>
            {dateSessions.map(session => (
                <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                        <Text style={styles.sessionDuration}>
                            {formatDuration(session.duration)}
                        </Text>
                        <View style={styles.sessionActions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEditSession(session)}
                            >
                                <MaterialCommunityIcons
                                    name="pencil"
                                    size={20}
                                    color={getColor.primary()}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteSession(session.id)}
                            >
                                <MaterialCommunityIcons
                                    name="delete"
                                    size={20}
                                    color={getColor.error()}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.sessionInfo}>
                        <View style={styles.petTags}>
                            {session.pets.map(petId => {
                                const pet = pets.find(p => p.id === petId);
                                return pet ? (
                                    <View key={pet.id} style={styles.petTag}>
                                        <Text style={styles.petTagText}>{pet.name}</Text>
                                    </View>
                                ) : null;
                            })}
                        </View>
                        {session.notes ? (
                            <Text style={styles.sessionNotes}>{session.notes}</Text>
                        ) : null}
                    </View>
                </View>
            ))}
        </View>
    );
  };

  const renderPetSelection = (): JSX.Element => (
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

  const renderTimer = (): JSX.Element => (
    <View style={styles.timerContainer}>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={[styles.controlButton, isRunning ? styles.stopButton : styles.startButton]}
          onPress={handleStartStop}
        >
          <Text style={styles.controlButtonText}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocationSelector = (): JSX.Element => (
    <View style={styles.locationContainer}>
      <TouchableOpacity
        style={[
          styles.locationButton,
          location === 'floor' && styles.selectedLocationButton
        ]}
        onPress={() => setLocation('floor')}
      >
        <MaterialIcons name="home" size={24} color={location === 'floor' ? getColor.background() : getColor.text()} />
        <Text style={[styles.locationButtonText, location === 'floor' && styles.selectedLocationButtonText]}>
          Floor Time
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.locationButton,
          location === 'garden' && styles.selectedLocationButton
        ]}
        onPress={() => setLocation('garden')}
      >
        <MaterialIcons name="grass" size={24} color={location === 'garden' ? getColor.background() : getColor.text()} />
        <Text style={[styles.locationButtonText, location === 'garden' && styles.selectedLocationButtonText]}>
          Garden Time
        </Text>
      </TouchableOpacity>
    </View>
  );

  const calendarTheme = {
    selectedDayBackgroundColor: getColor.primary(),
    selectedDayTextColor: getColor.background(),
    todayTextColor: getColor.primary(),
    dayTextColor: getColor.text(),
    textDisabledColor: getColor.textLight(),
    dotColor: getColor.primary(),
    selectedDotColor: getColor.background(),
    arrowColor: getColor.primary(),
    monthTextColor: getColor.text(),
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  };

  const startTimer = (): void => {
    setTimer(0);
    setIsRunning(true);
    setShowNotes(false);
  };

  const stopTimer = (): void => {
    setIsRunning(false);
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView 
        style={[styles.container, styles.keyboardAvoidingView, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={getColor.buttonBrown()} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playtime & Exercise</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderTimer()}

          {/* View Logs Button */}
          <TouchableOpacity
            style={styles.viewLogsButton}
            onPress={() => router.push('/(stack)/floor-time-logs')}
          >
            <MaterialIcons name="history" size={22} color={getColor.primary()} />
            <Text style={styles.viewLogsButtonText}>View Logs</Text>
          </TouchableOpacity>

          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={day => {
                setSelectedDate(day.dateString);
              }}
              markedDates={getMarkedDates()}
              theme={calendarTheme}
            />
          </View>

          {renderSessions()}
          {renderPetSelection()}
          {renderLocationSelector()}
          {showNotes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput as ViewStyle}
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
    backgroundColor: getColor.backgroundLight(),
  } as ViewStyle,
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
    backgroundColor: getColor.white(),
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: getColor.text(),
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  backButton: {
    padding: 8,
  } as ViewStyle,
  content: {
    flex: 1,
    padding: 16,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor.text(),
    marginBottom: 8,
  } as TextStyle,
  petList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  } as ViewStyle,
  petCard: {
    backgroundColor: getColor.background(),
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
  } as ViewStyle,
  selectedPetCard: {
    backgroundColor: getColor.primaryLight(),
    borderColor: getColor.primary(),
  } as ViewStyle,
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  petName: {
    fontSize: 16,
    color: getColor.text(),
    marginLeft: 8,
  } as TextStyle,
  selectedPetName: {
    color: getColor.primary(),
  } as TextStyle,
  timerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  } as ViewStyle,
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: getColor.text(),
  } as TextStyle,
  controlButton: {
    backgroundColor: getColor.primary(),
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  } as ViewStyle,
  controlButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  locationContainer: {
    marginVertical: 16,
  } as ViewStyle,
  locationButton: {
    flex: 1,
    backgroundColor: getColor.background(),
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
    alignItems: 'center',
  } as ViewStyle,
  selectedLocationButton: {
    backgroundColor: getColor.primaryLight(),
    borderColor: getColor.primary(),
  } as ViewStyle,
  locationButtonText: {
    color: getColor.text(),
    fontSize: 16,
  } as TextStyle,
  selectedLocationButtonText: {
    color: getColor.primary(),
  } as TextStyle,
  notesContainer: {
    marginTop: 16,
  } as ViewStyle,
  notesInput: {
    backgroundColor: getColor.background(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    padding: 12,
    color: getColor.text(),
    minHeight: 100,
    textAlignVertical: 'top',
  } as TextStyle,
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor.text(),
    marginBottom: 8,
  } as TextStyle,
  sessionsContainer: {
    flex: 1,
  } as ViewStyle,
  sessionCard: {
    backgroundColor: getColor.background(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  sessionInfo: {
    marginTop: 8,
  } as ViewStyle,
  sessionDuration: {
    fontSize: 14,
    color: getColor.text(),
  } as TextStyle,
  sessionActions: {
    flexDirection: 'row',
  } as ViewStyle,
  editButton: {
    padding: 8,
    marginLeft: 8,
  } as ViewStyle,
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  } as ViewStyle,
  petTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  } as ViewStyle,
  petTag: {
    backgroundColor: getColor.primaryLight(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  } as ViewStyle,
  petTagText: {
    color: getColor.primary(),
    fontSize: 12,
  } as TextStyle,
  calendarContainer: {
    marginVertical: 16,
  } as ViewStyle,
  scrollContent: {
    padding: 16,
  } as ViewStyle,
  viewLogsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getColor.cardBackground(),
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
    marginHorizontal: 0,
    gap: 8,
    borderWidth: 1,
    borderColor: getColor.primary(),
  } as ViewStyle,
  viewLogsButtonText: {
    color: getColor.primary(),
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  keyboardAvoidingView: {
    flex: 1,
    paddingTop: 0, // Will be set dynamically
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: getColor.textLight(),
    marginBottom: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: getColor.textLight(),
    textAlign: 'center',
    marginBottom: 16,
  },
  addPetButton: {
    backgroundColor: getColor.primary(),
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPetButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: getColor.primary(),
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionNotes: { fontSize: 14, color: getColor.textLight(), marginTop: 8 },
  section: { marginBottom: 20 },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 8,
  } as ViewStyle,
  startButton: {
    backgroundColor: getColor.primary(),
  } as ViewStyle,
  stopButton: {
    backgroundColor: getColor.error(),
  } as ViewStyle,
  resetButton: {
    backgroundColor: getColor.secondary(),
  } as ViewStyle,
});

export default FloorTimeScreen; 