import { BondingSession, GuineaPig } from '@/navigation/types';
import colors from '@/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Location = 'floor' | 'cage' | 'playpen' | 'outside';

const LOCATIONS: Location[] = ['floor', 'cage', 'playpen', 'outside'];
const LOCATION_EMOJIS: Record<Location, string> = {
    floor: '🏠',
    cage: '🏡',
    playpen: '🎪',
    outside: '🌳'
};

const LOCATION_LABELS: Record<Location, string> = {
    floor: 'Floor Time',
    cage: 'Cage',
    playpen: 'Playpen',
    outside: 'Outside'
};

const BondingTimerScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    const [pets, setPets] = useState<GuineaPig[]>([]);
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState<Location>('playpen');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [sessions, setSessions] = useState<BondingSession[]>([]);
    const [showSessions, setShowSessions] = useState(false);
    const [editingSession, setEditingSession] = useState<BondingSession | null>(null);
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        loadPets();
        loadSessions();
    }, []);

    const loadPets = async () => {
        try {
            const savedPets = await AsyncStorage.getItem('@guineapals_pets');
            if (savedPets) {
                const parsedPets = JSON.parse(savedPets) as GuineaPig[];
                setPets(parsedPets);
            }
        } catch (error) {
            console.error('Failed to load pets:', error);
        }
    };

    const loadSessions = async () => {
        try {
            const savedSessions = await AsyncStorage.getItem('bondingSessions');
            if (savedSessions) {
                setSessions(JSON.parse(savedSessions));
            }
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    };

    const startTimer = () => {
        if (selectedPets.length < 2) {
            Alert.alert('Error', 'Please select at least 2 pets to start bonding');
            return;
        }

        setIsRunning(true);
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
        setIsRunning(false);
    };

    const resetTimer = () => {
        stopTimer();
        setTimer(0);
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePetSelect = (petId: string) => {
        if (selectedPets.includes(petId)) {
            setSelectedPets(prev => prev.filter(id => id !== petId));
        } else {
            setSelectedPets(prev => [...prev, petId]);
        }
    };

    const handleSaveSession = async () => {
        if (selectedPets.length < 2) {
            Alert.alert('Error', 'Please select at least 2 pets to save the session');
            return;
        }

        try {
            const session: BondingSession = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                duration: timer,
                pets: selectedPets,
                location: location,
                behaviors: [],
                notes: notes.trim(),
                success: 'neutral'
            };

            const savedSessions = await AsyncStorage.getItem('bondingSessions');
            const sessions = savedSessions ? JSON.parse(savedSessions) : [];
            await AsyncStorage.setItem('bondingSessions', JSON.stringify([...sessions, session]));

            Alert.alert('Success', 'Bonding session saved successfully', [
                {
                    text: 'View Logs',
                    onPress: () => router.push('/(stack)/bonding-tracker')
                },
                {
                    text: 'New Session',
                    onPress: () => {
                        resetTimer();
                        setNotes('');
                    }
                }
            ]);
        } catch (error) {
            console.error('Failed to save session:', error);
            Alert.alert('Error', 'Failed to save the bonding session');
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
                            await AsyncStorage.setItem('bondingSessions', JSON.stringify(updatedSessions));
                            setSessions(updatedSessions);
                        } catch (error) {
                            console.error('Failed to delete session:', error);
                            Alert.alert('Error', 'Failed to delete session');
                        }
                    }
                }
            ]
        );
    };

    const handleEditSession = async (session: BondingSession) => {
        setEditingSession(session);
        setNotes(session.notes || '');
        setLocation(session.location);
        setSelectedPets(session.pets);
        setTimer(session.duration);
        setShowNotes(true);
    };

    const handleUpdateSession = async () => {
        if (!editingSession) return;

        try {
            const updatedSession: BondingSession = {
                ...editingSession,
                duration: timer,
                location,
                notes: notes.trim(),
                pets: selectedPets
            };

            const updatedSessions = sessions.map(session => 
                session.id === editingSession.id ? updatedSession : session
            );
            
            await AsyncStorage.setItem('bondingSessions', JSON.stringify(updatedSessions));
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
                                <Text style={styles.locationEmoji}>
                                    {LOCATION_EMOJIS[session.location]}
                                </Text>
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
                                    <MaterialCommunityIcons name="pencil" size={20} color={colors.primary.DEFAULT} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteSession(session.id)}
                                >
                                    <MaterialCommunityIcons name="delete-outline" size={20} color={colors.status.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {session.notes && (
                            <Text style={styles.sessionNotes}>{session.notes}</Text>
                        )}
                        <View style={styles.sessionPets}>
                            <Text style={styles.sessionPetsText}>
                                {session.pets.map(petId => pets.find(p => p.id === petId)?.name).filter(Boolean).join(' & ')}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
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
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <Text style={styles.title}>Bonding Sessions</Text>
                <TouchableOpacity
                    style={styles.logButton}
                    onPress={() => router.push('/(stack)/bonding-tracker')}
                >
                    <View style={styles.logButtonContent}>
                        <MaterialCommunityIcons name="history" size={24} color={colors.primary.DEFAULT} />
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
                        onDayPress={(day) => {
                            setSelectedDate(day.dateString);
                            setShowSessions(true);
                        }}
                        markedDates={getMarkedDates()}
                        theme={{
                            backgroundColor: colors.background.card,
                            calendarBackground: colors.background.card,
                            textSectionTitleColor: colors.text.primary,
                            selectedDayBackgroundColor: colors.primary.DEFAULT,
                            selectedDayTextColor: colors.text.light,
                            todayTextColor: colors.primary.DEFAULT,
                            dayTextColor: colors.text.primary,
                            textDisabledColor: colors.text.secondary,
                            dotColor: colors.primary.DEFAULT,
                            selectedDotColor: colors.text.light,
                            arrowColor: colors.primary.DEFAULT,
                            monthTextColor: colors.text.primary,
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontSize: 16,
                            textDayFontSize: 16,
                            textMonthFontSize: 16
                        }}
                    />
                </View>

                {showSessions && renderSessions()}

                {showNotes && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesTitle}>Notes</Text>
                        <TextInput
                            style={styles.notesInput}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add notes about the session..."
                            placeholderTextColor={colors.text.secondary}
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={editingSession ? handleUpdateSession : handleSaveSession}
                        >
                            <Text style={styles.saveButtonText}>
                                {editingSession ? 'Update Session' : 'Save Session'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.timerContainer}>
                    <Text style={styles.timer}>{formatTime(timer)}</Text>
                    <View style={styles.timerControls}>
                        {!isRunning ? (
                            <TouchableOpacity 
                                style={[styles.button, styles.startButton]} 
                                onPress={startTimer}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={[styles.button, styles.stopButton]} 
                                onPress={stopTimer}
                            >
                                <Text style={styles.buttonText}>Stop</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[styles.button, styles.resetButton]} 
                            onPress={resetTimer}
                        >
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {!isRunning && timer > 0 && (
                    <TouchableOpacity 
                        style={[styles.bottomSaveButton, { bottom: insets.bottom + 16 }]} 
                        onPress={handleSaveSession}
                    >
                        <Text style={styles.bottomSaveButtonText}>Save Session</Text>
                    </TouchableOpacity>
                )}

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
                        ) :
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
                                        <MaterialCommunityIcons 
                                            name={selectedPets.includes(pet.id) ? "check-circle" : "circle-outline"} 
                                            size={24} 
                                            color={selectedPets.includes(pet.id) ? colors.text.light : colors.text.primary} 
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.locationList}>
                        {LOCATIONS.map((loc) => (
                            <TouchableOpacity
                                key={loc}
                                style={[
                                    styles.locationCard,
                                    location === loc && styles.selectedLocationCard
                                ]}
                                onPress={() => setLocation(loc)}
                            >
                                <Text style={[
                                    styles.locationText,
                                    location === loc && styles.selectedLocationText
                                ]}>
                                    {LOCATION_EMOJIS[loc]} {LOCATION_LABELS[loc]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    timerContainer: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.background.card,
        margin: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 16,
    },
    timerControls: {
        flexDirection: 'row',
        gap: 16,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: colors.status.success,
    },
    stopButton: {
        backgroundColor: colors.status.error,
    },
    resetButton: {
        backgroundColor: colors.buttons.secondary,
    },
    buttonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        padding: 16,
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
        color: colors.text.light,
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
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: colors.primary.DEFAULT,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    saveButtonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    notesInput: {
        backgroundColor: colors.background.card,
        borderRadius: 8,
        padding: 12,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    locationList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    locationCard: {
        backgroundColor: colors.background.card,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        width: '48%',
        marginBottom: 8,
    },
    selectedLocationCard: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    locationText: {
        fontSize: 16,
        color: colors.text.primary,
        textAlign: 'center',
    },
    selectedLocationText: {
        color: colors.text.light,
        fontWeight: '600',
    },
    calendarContainer: {
        backgroundColor: colors.background.card,
        margin: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sessionsContainer: {
        padding: 16,
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
        fontWeight: '500',
        color: colors.text.primary,
    },
    sessionTime: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    sessionNotes: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 8,
    },
    sessionPets: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sessionPetsText: {
        fontSize: 14,
        color: colors.text.secondary,
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
    locationEmoji: {
        fontSize: 24,
    },
    notesContainer: {
        padding: 16,
    },
    notesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 16,
    },
    bottomSaveButton: {
        position: 'absolute',
        left: 16,
        right: 16,
        backgroundColor: colors.primary.DEFAULT,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    bottomSaveButtonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BondingTimerScreen; 