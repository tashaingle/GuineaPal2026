import AppHeader from '@/components/AppHeader';
import { GuineaPig, WasteLog } from '@/navigation/types';
import colors from '@/theme/colors';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    route: {
        params: {
            petId: string;
        };
    };
};

const WASTE_EMOJIS = {
    poop: '💩',
    pee: '💧',
};

const WasteLogScreen = ({ route }: Props) => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [logs, setLogs] = useState<WasteLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<WasteLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [pet, setPet] = useState<GuineaPig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (selectedDate) {
            const filtered = logs.filter(log => {
                const logDate = new Date(log.date).toISOString().split('T')[0];
                return logDate === selectedDate;
            });
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [selectedDate, logs]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const pets = await loadPets();
            const currentPet = pets.find(p => p.id === route.params.petId);
            if (!currentPet) {
                console.error('Pet not found with ID:', route.params.petId);
                Alert.alert('Error', 'Pet not found');
                router.back();
                return;
            }
            setPet(currentPet);
            setLogs(currentPet.wasteLogs || []);
            setFilteredLogs(currentPet.wasteLogs || []);
        } catch (error) {
            console.error('Failed to load waste logs:', error);
            Alert.alert('Error', 'Failed to load waste logs');
        } finally {
            setIsLoading(false);
        }
    };

    const getMarkedDates = () => {
        const markedDates: { 
            [key: string]: { 
                marked: boolean; 
                dotColor: string;
                selected?: boolean;
                selectedColor?: string;
            } 
        } = {};
        
        logs.forEach(log => {
            const date = new Date(log.date).toISOString().split('T')[0];
            if (date) {
                markedDates[date] = {
                    marked: true,
                    dotColor: log.type === 'poop' ? '#795548' : '#64B5F6'
                };
            }
        });
        
        if (selectedDate) {
            markedDates[selectedDate] = {
                ...(markedDates[selectedDate] || { marked: true, dotColor: '#5D4037' }),
                selected: true,
                selectedColor: '#5D4037'
            };
        }
        
        return markedDates;
    };

    const handleDateSelect = (date: DateData) => {
        setSelectedDate(date.dateString === selectedDate ? null : date.dateString);
    };

    const formatLogDetails = (log: WasteLog) => {
        const details = [];

        if (log.type === 'poop') {
            details.push(`Consistency: ${log.poopConsistency?.replace('_', ' ')}`);
            details.push(`Color: ${log.poopColor?.replace('_', ' ')}`);
        } else {
            details.push(`Color: ${log.peeColor?.replace('_', ' ')}`);
            details.push(`Volume: ${log.peeVolume}`);
        }

        const frequencyLabel = log.frequencyType === 'per_hour' ? 'per hour' : 'per day';
        details.push(`Frequency: ${log.frequency} time${log.frequency > 1 ? 's' : ''} ${frequencyLabel}`);
        if (log.location) details.push(`Location: ${log.location}`);

        return details;
    };

    const handleEditLog = (log: WasteLog) => {
        router.push({
            pathname: '/(stack)/add-waste-log',
            params: {
                petId: route.params.petId,
                logId: log.id,
                isEditing: 'true'
            }
        });
    };

    const handleDeleteLog = async (logId: string) => {
        Alert.alert(
            'Delete Log',
            'Are you sure you want to delete this log?',
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
                            const pets = await loadPets();
                            const pet = pets.find(p => p.id === params.petId);
                            if (!pet) return;

                            const updatedPet: GuineaPig = {
                                ...pet,
                                wasteLogs: (pet.wasteLogs || []).filter(log => log.id !== logId)
                            };

                            const updatedPets = pets.map(p => p.id === pet.id ? updatedPet : p);
                            await savePets(updatedPets);
                            await loadData();
                        } catch (error) {
                            console.error('Failed to delete waste log:', error);
                            Alert.alert('Error', 'Failed to delete waste log');
                        }
                    }
                }
            ]
        );
    };

    const renderLog = ({ item }: { item: WasteLog }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.logCard}
            onPress={() => handleEditLog(item)}
        >
            <View style={styles.logHeader}>
                <View style={styles.logTypeContainer}>
                    <MaterialIcons
                        name={item.type === 'poop' ? 'wc' : 'water-drop'}
                        size={24}
                        color={item.type === 'poop' ? '#795548' : '#2196F3'}
                    />
                    <Text style={styles.logType}>
                        {item.type === 'poop' ? 'Poop' : 'Pee'}
                    </Text>
                </View>
                <View style={styles.logActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditLog(item)}
                    >
                        <MaterialIcons name="edit" size={20} color="#5D4037" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteLog(item.id)}
                    >
                        <MaterialIcons name="delete" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                {formatLogDetails(item).map((detail, index) => (
                    <Text key={index} style={styles.detailText}>
                        • {detail}
                    </Text>
                ))}
            </View>

            {item.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                    {item.notes}
                </Text>
            )}
        </TouchableOpacity>
    );

    const addNewLog = () => {
        router.push({
            pathname: '/(stack)/add-waste-log',
            params: {
                petId: route.params.petId,
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <AppHeader title="Waste Log" />
            </View>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={addNewLog}
                >
                    <MaterialIcons name="add" size={24} color={colors.background.DEFAULT} />
                    <Text style={styles.addButtonText}>Add Waste Log</Text>
                </TouchableOpacity>

                <FlatList
                    data={filteredLogs}
                    renderItem={renderLog}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <View style={styles.banner}>
                                <Text style={styles.bannerTitle}>{pet ? `${pet.name}'s Waste Log` : 'Waste Log'}</Text>
                                <Text style={styles.bannerSubtitle}>Track your pet's waste patterns</Text>
                            </View>
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    current={selectedDate || undefined}
                                    onDayPress={handleDateSelect}
                                    markedDates={getMarkedDates()}
                                    theme={{
                                        calendarBackground: colors.background.card,
                                        textSectionTitleColor: colors.text.primary,
                                        selectedDayBackgroundColor: colors.primary.DEFAULT,
                                        selectedDayTextColor: colors.background.card,
                                        todayTextColor: colors.primary.DEFAULT,
                                        dayTextColor: colors.text.primary,
                                        textDisabledColor: colors.text.secondary,
                                        dotColor: colors.primary.DEFAULT,
                                        selectedDotColor: colors.background.card,
                                        arrowColor: colors.primary.DEFAULT,
                                        monthTextColor: colors.text.primary
                                    }}
                                />
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons name="pets" size={48} color="#BDBDBD" />
                            <Text style={styles.emptyText}>No waste logs for this date</Text>
                            <Text style={styles.emptySubtext}>
                                Tap the + button to add a new waste log
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT
    },
    headerContainer: {
        zIndex: 1000,
        elevation: 1000,
        marginTop: 16,
        marginHorizontal: 16
    },
    content: {
        flex: 1,
        padding: 16,
        marginTop: 16
    },
    header: {
        padding: 16
    },
    banner: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 4
    },
    bannerSubtitle: {
        fontSize: 16,
        color: '#795548'
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    listContent: {
        padding: 16
    },
    logCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    logTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginLeft: 8
    },
    logActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    editButton: {
        padding: 4
    },
    deleteButton: {
        padding: 4
    },
    detailsContainer: {
        marginBottom: 8
    },
    detailText: {
        fontSize: 14,
        color: '#795548',
        marginBottom: 4
    },
    notes: {
        fontSize: 14,
        color: '#757575',
        fontStyle: 'italic',
        marginTop: 8
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 8
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#5D4037'
    },
    emptySubtext: {
        fontSize: 14,
        color: '#795548',
        textAlign: 'center'
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.buttons.brown,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1
    },
    addButtonText: {
        color: colors.background.DEFAULT,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8
    }
});

export default WasteLogScreen; 