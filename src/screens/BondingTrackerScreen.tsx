import colors from '@/theme/colors';
import { GuineaPig } from '@/types/guineaPig';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define types for behaviors and locations
type Behavior = 'playing' | 'grooming' | 'cuddling' | 'fighting' | 'ignoring';
type Location = 'floor' | 'cage' | 'playpen' | 'outside';

// Define BondingSession interface
interface BondingSession {
    id: string;
    date: string;
    duration: number;
    pets: string[];
    behaviors: Behavior[];
    location: Location;
    notes?: string;
    success?: 'positive' | 'neutral' | 'negative';
}

const COMMON_BEHAVIORS: Behavior[] = ['playing', 'grooming', 'cuddling', 'fighting', 'ignoring'];
const BEHAVIOR_EMOJIS: Record<Behavior, string> = {
    playing: '🎾',
    grooming: '🪮',
    cuddling: '💕',
    fighting: '⚔️',
    ignoring: '😴'
};

const LOCATIONS: Location[] = ['floor', 'cage', 'playpen', 'outside'];
const LOCATION_EMOJIS: Record<Location, string> = {
    floor: '🏠',
    cage: '🏡',
    playpen: '🎪',
    outside: '🌳'
};

const BondingTrackerScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [sessions, setSessions] = useState<BondingSession[]>([]);
    const [pets, setPets] = useState<GuineaPig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPair, setExpandedPair] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const savedPets = await loadPets();
            setPets(savedPets);

            const savedSessions = await AsyncStorage.getItem('bondingSessions');
            console.log('Raw saved sessions:', savedSessions); // Debug log
            const allSessions: BondingSession[] = savedSessions ? JSON.parse(savedSessions) : [];
            console.log('Parsed sessions:', allSessions); // Debug log
            
            const sortedSessions = allSessions.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            
            setSessions(sortedSessions);
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Failed to load bonding sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const getPetNames = (petIds: string[]) => {
        return petIds
            .map(id => pets.find(pet => pet.id === id)?.name)
            .filter(Boolean)
            .join(' & ');
    };

    const getPetPairKey = (petIds: string[]) => {
        return petIds.sort().join('-');
    };

    const groupSessionsByPetPair = () => {
        const groupedSessions: Record<string, BondingSession[]> = {};
        
        sessions.forEach(session => {
            const pairKey = getPetPairKey(session.pets);
            if (!groupedSessions[pairKey]) {
                groupedSessions[pairKey] = [];
            }
            groupedSessions[pairKey].push(session);
        });

        return groupedSessions;
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderSession = (session: BondingSession) => {
        return (
            <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                    <Text style={styles.sessionDuration}>{formatDuration(session.duration)}</Text>
                </View>
                
                <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="place" size={20} color={colors.text.secondary} />
                        <Text style={styles.detailText}>
                            {LOCATION_EMOJIS[session.location]} {session.location}
                        </Text>
                    </View>
                    
                    {session.behaviors.length > 0 && (
                        <View style={styles.detailRow}>
                            <MaterialIcons name="pets" size={20} color={colors.text.secondary} />
                            <Text style={styles.detailText}>
                                {session.behaviors.map(b => BEHAVIOR_EMOJIS[b]).join(' ')}
                            </Text>
                        </View>
                    )}
                    
                    {session.notes && (
                        <View style={styles.detailRow}>
                            <MaterialIcons name="note" size={20} color={colors.text.secondary} />
                            <Text style={styles.detailText}>{session.notes}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderPetPair = (pairKey: string, pairSessions: BondingSession[]) => {
        const petNames = getPetNames(pairSessions[0].pets);
        const isExpanded = expandedPair === pairKey;
        const totalSessions = pairSessions.length;
        const totalDuration = pairSessions.reduce((sum, session) => sum + session.duration, 0);

        return (
            <View key={pairKey} style={styles.pairContainer}>
                <TouchableOpacity
                    style={styles.pairHeader}
                    onPress={() => setExpandedPair(isExpanded ? null : pairKey)}
                >
                    <View style={styles.pairInfo}>
                        <Text style={styles.pairTitle}>{petNames}</Text>
                        <Text style={styles.pairStats}>
                            {totalSessions} sessions • {formatDuration(totalDuration)}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={isExpanded ? "expand-less" : "expand-more"}
                        size={24}
                        color={colors.text.primary}
                    />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.sessionsList}>
                        {pairSessions.map(session => renderSession(session))}
                    </View>
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
        );
    }

    const groupedSessions = groupSessionsByPetPair();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <Text style={styles.title}>Bonding Log</Text>
                <TouchableOpacity
                    style={styles.newSessionButton}
                    onPress={() => router.push('/(stack)/bonding-timer')}
                >
                    <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {Object.entries(groupedSessions).map(([pairKey, pairSessions]) => 
                    renderPetPair(pairKey, pairSessions)
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
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
    newSessionButton: {
        padding: 8,
        marginRight: -8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    pairContainer: {
        marginBottom: 16,
        backgroundColor: colors.background.card,
        borderRadius: 12,
        overflow: 'hidden',
    },
    pairHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.background.card,
    },
    pairInfo: {
        flex: 1,
    },
    pairTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    pairStats: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    sessionsList: {
        padding: 16,
        backgroundColor: colors.background.DEFAULT,
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
        marginBottom: 8,
    },
    sessionDate: {
        fontSize: 14,
        color: colors.text.primary,
        fontWeight: '500',
    },
    sessionDuration: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    sessionDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: colors.text.secondary,
        flex: 1,
    },
});

export default BondingTrackerScreen; 