import { GuineaPig } from '@/types/guineaPig';
import { loadPets } from '@/utils/storage';
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

const FloorTimeLogsScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [sessions, setSessions] = useState<FloorTimeSession[]>([]);
    const [pets, setPets] = useState<GuineaPig[]>([]);

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
                const parsedSessions = JSON.parse(savedSessions);
                // Sort sessions by date in descending order (newest first)
                parsedSessions.sort((a: FloorTimeSession, b: FloorTimeSession) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setSessions(parsedSessions);
            }
            if (savedPets) {
                setPets(savedPets);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            Alert.alert('Error', 'Failed to load saved data');
        }
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

    const renderSessions = () => {
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
                                    color={colors.primary.DEFAULT} 
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
                                    <MaterialIcons name="delete-outline" size={20} color={colors.status.error} />
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
                    <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <Text style={styles.title}>Floor Time Logs</Text>
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
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sessionsContainer: {
        marginTop: 16,
    },
    sessionCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
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
        gap: 8,
    },
    sessionDuration: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    sessionActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sessionTime: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    deleteButton: {
        padding: 4,
    },
    sessionNotes: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 8,
    },
    petTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    petTag: {
        backgroundColor: colors.primary.light,
        color: colors.primary.DEFAULT,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.text.secondary,
    },
});

export default FloorTimeLogsScreen; 