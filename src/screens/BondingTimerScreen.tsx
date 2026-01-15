import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { usePets } from '../hooks/usePets';
import { getColor } from '../theme/colors';
import { showInterstitialAd } from '../utils/ads';
import { logger } from '../utils/logger';
import { getBondingSessions, getPets } from '../utils/storage';

type Location = 'playpen' | 'garden' | 'room';

interface BondingSession {
    id: string;
    date: string;
    duration: number;
    location: Location;
    notes?: string;
    pets: string[];
    behaviors: string[];
}

const LOCATIONS: Location[] = ['playpen', 'garden', 'room'];
const LOCATION_EMOJIS: Record<Location, string> = {
    playpen: '🎪',
    garden: '🌳',
    room: '🏠'
};

const LOCATION_LABELS: Record<Location, string> = {
    playpen: 'Playpen',
    garden: 'Garden',
    room: 'Room'
};

const BondingTimerScreen: React.FC = (): JSX.Element => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { pets } = usePets();
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [location, setLocation] = useState<Location>('playpen');
    const [startTime, setStartTime] = useState<number>(0);
    const [calendarMarkedDates, setCalendarMarkedDates] = useState<{}>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [sessionsByDate, setSessionsByDate] = useState<Record<string, BondingSession[]>>({});
    const [sessionsForSelectedDate, setSessionsForSelectedDate] = useState<BondingSession[]>([]);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                await Promise.all([
                    getPets(),
                    getBondingSessions()
                ]);
                // Note: setPets is not available in this context, pets are loaded via usePets hook
                loadCalendarData();
            } catch (error) {
                logger.error('Failed to load data:', error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        }
        return (): void => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, startTime]);

    const startTimer = (): void => {
        if (!isRunning) {
            setIsRunning(true);
            setStartTime(Date.now() - elapsedTime * 1000);
        }
    };

    const stopTimer = (): void => {
        if (isRunning) {
            setIsRunning(false);
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
    };

    const resetTimer = (): void => {
        setIsRunning(false);
        setElapsedTime(0);
        setStartTime(Date.now());
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePetSelection = (petId: string): void => {
        setSelectedPets(prev => 
            prev.includes(petId) 
                ? prev.filter(id => id !== petId)
                : [...prev, petId]
        );
    };

    const handleLocationSelection = (newLocation: Location): void => {
        setLocation(newLocation);
    };

    const handleSaveSession = async (): Promise<void> => {
        if (selectedPets.length < 2) {
            Alert.alert('Error', 'Please select at least 2 pets to save the session');
            return;
        }

        try {
            const session: BondingSession = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                duration: elapsedTime,
                pets: selectedPets,
                location: location,
                notes: notes.trim(),
                behaviors: [],
            };

            const savedSessions = await AsyncStorage.getItem('bondingSessions');
            const sessions = savedSessions ? JSON.parse(savedSessions) : [];
            await AsyncStorage.setItem('bondingSessions', JSON.stringify([...sessions, session]));

            // Show ad when saving a bonding session
            try {
                await showInterstitialAd();
            } catch (adError) {
                console.warn('Failed to show interstitial ad:', adError);
                // Don't fail the session save if ad fails
            }

            Alert.alert('Success', 'Bonding session saved successfully', [
                {
                    text: 'View Logs',
                    onPress: (): void => router.push('/(stack)/bonding-tracker')
                },
                {
                    text: 'New Session',
                    onPress: (): void => {
                        resetTimer();
                        setNotes('');
                    }
                }
            ]);
        } catch (error) {
            logger.error('Failed to save session:', error);
            Alert.alert('Error', 'Failed to save the bonding session');
        }
    };

    const handleStart = (): void => {
        if (selectedPets.length < 2) {
            Alert.alert('Error', 'Please select at least 2 pets to start the session');
            return;
        }
        startTimer();
    };

    const handleStop = (): void => {
        stopTimer();
    };

    const handleReset = (): void => {
        resetTimer();
        setNotes('');
        setSelectedPets([]);
    };

    const loadCalendarData = async (): Promise<void> => {
        const savedSessions = await AsyncStorage.getItem('bondingSessions');
        const sessions = savedSessions ? JSON.parse(savedSessions) : [];
        const marked: Record<string, { marked: boolean; dotColor: string }> = {};
        const byDate: Record<string, BondingSession[]> = {};
        sessions.forEach((session: BondingSession) => {
            const date = session.date.split('T')[0];
            marked[date] = { marked: true, dotColor: '#8D5524' };
            if (!byDate[date]) byDate[date] = [];
            byDate[date].push(session);
        });
        setCalendarMarkedDates(marked);
        setSessionsByDate(byDate);
    };

    const handleDayPress = (day: DateData): void => {
        setSelectedDate(day.dateString);
        setSessionsForSelectedDate(sessionsByDate[day.dateString] || []);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader 
                title="Bonding Timer"
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                        <View style={styles.timerControls}>
                            {!isRunning ? (
                                <TouchableOpacity
                                    style={[styles.timerButton, styles.startButton]}
                                    onPress={handleStart}
                                >
                                    <Text style={styles.buttonText}>Start</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.timerButton, styles.stopButton]}
                                    onPress={handleStop}
                                >
                                    <Text style={styles.buttonText}>Stop</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.timerButton, styles.resetButton]}
                                onPress={handleReset}
                            >
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* View Logs Button */}
                    <TouchableOpacity
                        style={styles.viewLogsButton}
                        onPress={() => router.push('/(stack)/bonding-tracker')}
                    >
                        <MaterialIcons name="list-alt" size={22} color={getColor.primary()} />
                        <Text style={styles.viewLogsButtonText}>View Logs</Text>
                    </TouchableOpacity>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            markedDates={calendarMarkedDates}
                            onDayPress={handleDayPress}
                            style={styles.calendar}
                        />
                        {selectedDate && (
                            <View style={styles.selectedDateContainer}>
                                <Text style={styles.selectedDateTitle}>
                                    Sessions on {selectedDate}:
                                </Text>
                                {sessionsForSelectedDate.length > 0 ? (
                                    sessionsForSelectedDate.map(session => (
                                        <View key={session.id} style={styles.sessionCard}>
                                            <Text>Duration: {formatTime(session.duration)}</Text>
                                            <Text>Location: {LOCATION_LABELS[session.location]}</Text>
                                            {session.notes ? <Text>Notes: {session.notes}</Text> : null}
                                        </View>
                                    ))
                                ) : (
                                    <Text>No sessions for this day.</Text>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.petsContainer}>
                        <Text style={styles.sectionTitle}>Select Pets</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {pets.map(pet => (
                                <TouchableOpacity
                                    key={pet.id}
                                    style={[
                                        styles.petButton,
                                        selectedPets.includes(pet.id) && styles.selectedPetButton
                                    ]}
                                    onPress={() => handlePetSelection(pet.id)}
                                >
                                    <Text style={[
                                        styles.petButtonText,
                                        selectedPets.includes(pet.id) && styles.selectedPetButtonText
                                    ]}>
                                        {pet.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.locationContainer}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.locationButtons}>
                            {LOCATIONS.map(loc => (
                                <TouchableOpacity
                                    key={loc}
                                    style={[
                                        styles.locationButton,
                                        location === loc && styles.selectedLocationButton
                                    ]}
                                    onPress={() => handleLocationSelection(loc)}
                                >
                                    <Text style={styles.locationEmoji}>{LOCATION_EMOJIS[loc]}</Text>
                                    <Text style={[
                                        styles.locationText,
                                        location === loc && styles.selectedLocationText
                                    ]}>
                                        {LOCATION_LABELS[loc]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.notesContainer}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <TextInput
                            style={styles.notesInput}
                            multiline
                            numberOfLines={4}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any notes about the session..."
                            
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveSession}
                    >
                        <Text style={styles.saveButtonText}>Save Session</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: getColor.backgroundLight(),
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: getColor.text(),
        marginBottom: 16,
    },
    timerControls: {
        flexDirection: 'row',
        gap: 16,
    },
    timerButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: getColor.primary(),
    },
    stopButton: {
        backgroundColor: getColor.error(),
    },
    resetButton: {
        backgroundColor: getColor.secondary(),
    },
    buttonText: {
        color: getColor.background(),
        fontSize: 16,
        fontWeight: 'bold',
    },
    petsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: getColor.text(),
        marginBottom: 12,
    },
    petButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: getColor.cardBackground(),
        marginRight: 8,
    },
    selectedPetButton: {
        backgroundColor: getColor.primary(),
    },
    petButtonText: {
        color: getColor.text(),
        fontSize: 14,
    },
    selectedPetButtonText: {
        color: getColor.background(),
    },
    locationContainer: {
        marginBottom: 24,
    },
    locationButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: getColor.cardBackground(),
        gap: 8,
    },
    selectedLocationButton: {
        backgroundColor: getColor.primary(),
    },
    locationEmoji: {
        fontSize: 20,
    },
    locationText: {
        color: getColor.text(),
        fontSize: 14,
    },
    selectedLocationText: {
        color: getColor.background(),
    },
    notesContainer: {
        marginBottom: 24,
    },
    notesInput: {
        backgroundColor: getColor.cardBackground(),
        borderRadius: 8,
        padding: 12,
        color: getColor.text(),
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: getColor.primary(),
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: getColor.background(),
        fontSize: 16,
        fontWeight: 'bold',
    },
    calendarContainer: {
        marginBottom: 24,
    },
    calendar: {
        borderRadius: 12,
    },
    selectedDateContainer: {
        marginTop: 12,
    },
    selectedDateTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: getColor.text(),
    },
    sessionCard: {
        padding: 8,
        backgroundColor: getColor.cardBackground(),
        borderRadius: 8,
        marginBottom: 6,
    },
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
    },
    viewLogsButtonText: {
        color: getColor.primary(),
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BondingTimerScreen; 


