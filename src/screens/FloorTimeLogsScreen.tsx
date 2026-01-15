import { GuineaPig } from '@/types/guineaPig';
import { Pet } from '@/types/pet';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../theme/colors';
import { getPets } from '../utils/storage';

interface FloorTimeSession {
    id: string;
    date: string;
    duration: number;
    location: 'floor' | 'garden';
    notes: string;
    success: 'success' | 'neutral' | 'failure';
    pets: string[];
}

const FloorTimeLogsScreen = (): JSX.Element => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [sessions, setSessions] = useState<FloorTimeSession[]>([]);
    const [pets, setPets] = useState<GuineaPig[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (): Promise<void> => {
        try {
            // setIsLoading(true);
            const [savedSessions, savedPets] = await Promise.all([
                AsyncStorage.getItem('floor_time_sessions'),
                getPets()
            ]);
            
            const mapPetToGuineaPig = (pet: Pet): GuineaPig => {
                return {
                    id: pet.id,
                    name: pet.name,
                    breed: pet.breed,
                    birthDate: pet.birthDate,
                    weight: pet.weight,
                    gender: pet.gender,
                    image: pet.image,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
            };

            const sessions = savedSessions ? JSON.parse(savedSessions) : [];
            const pets = savedPets.map(mapPetToGuineaPig);
            setSessions(sessions);
            setPets(pets);
        } catch (err) {
            console.error('Failed to load data:', err);
            Alert.alert('Error', 'Failed to load saved data');
        } finally {
            // setIsLoading(false);
        }
    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const handleDeleteSession = async (sessionId: string): Promise<void> => {
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

    const renderSessions = (): JSX.Element => {
        if (sessions.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No sessions recorded yet</Text>
                </View>
            );
        }

        return (
            <View style={styles.sessionsContainer}>
                {sessions.map(session => (
                    <View key={session.id} style={styles.sessionCard}>
                        <View style={styles.sessionHeader}>
                            <View style={styles.sessionInfo}>
                                <MaterialIcons 
                                    name={session.location === 'floor' ? 'home' : 'grass'} 
                                    size={24} 
                                    color={getColor.primary()} 
                                />
                                <Text style={styles.sessionDuration}>
                                    {formatDuration(session.duration)}
                                </Text>
                            </View>
                            <View style={styles.sessionActions}>
                                <Text style={styles.sessionTime}>
                                    {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteSession(session.id)}
                                >
                                    <MaterialIcons name="delete-outline" size={20} color={getColor.error()} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {session.notes && (
                            <Text style={styles.sessionNotes}>{session.notes}</Text>
                        )}
                        <View style={styles.petTags}>
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

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={getColor.primary()} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Floor Time Logs</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {renderSessions()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: getColor.backgroundLight(),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: getColor.white(),
        borderBottomWidth: 1,
        borderBottomColor: getColor.border(),
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: getColor.text(),
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sessionsContainer: {
        flex: 1,
        padding: 16,
    },
    sessionCard: {
        backgroundColor: getColor.cardBackground(),
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    },
    sessionDuration: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: getColor.text(),
    },
    sessionActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionTime: {
        fontSize: 14,
        color: getColor.textLight(),
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    sessionNotes: {
        fontSize: 14,
        color: getColor.textLight(),
        marginBottom: 8,
    },
    petTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    petTag: {
        fontSize: 12,
        color: getColor.textLight(),
        backgroundColor: getColor.borderLight(),
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyStateText: {
        fontSize: 16,
        color: getColor.textLight(),
        textAlign: 'center',
    },
});

export default FloorTimeLogsScreen; 