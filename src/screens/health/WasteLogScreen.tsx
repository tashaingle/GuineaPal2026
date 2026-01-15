import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { GuineaPig, WasteLog } from '@/types/guineaPig';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Pet type not needed - using GuineaPig

type Props = {
    route: {
        params: {
            petId: string;
        };
    };
};

const WasteLogScreen: React.FC<Props> = ({ route }): JSX.Element => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [logs, setLogs] = useState<WasteLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<WasteLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const isFocused = useIsFocused();
    const [isAddingRecord, setIsAddingRecord] = useState(false);
    const [newRecord, setNewRecord] = useState<Partial<WasteLog>>({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'poop',
        amount: 'medium',
        color: 'Brown',
        notes: ''
    });

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

    const loadData = async (): Promise<void> => {
        try {
            const pets = await loadPets();
            const currentPet = pets.find(p => p.id === route.params.petId);
            if (!currentPet) {
                Alert.alert('Error', 'Pet not found');
                router.back();
                return;
            }
            if ((currentPet as GuineaPig).wasteLogs) {
                setLogs((currentPet as GuineaPig).wasteLogs || []);
            }
        } catch {
            Alert.alert('Error', 'Failed to load waste logs. Please try again.');
        }
    };

    const getMarkedDates = (): Record<string, {
        marked: boolean;
        dotColor: string;
        selected?: boolean;
        selectedColor?: string;
    }> => {
        const markedDates: Record<string, {
            marked: boolean;
            dotColor: string;
            selected?: boolean;
            selectedColor?: string;
        }> = {};
        
        logs.forEach(log => {
            const date = new Date(log.date).toISOString().split('T')[0];
            if (date) {
                markedDates[date] = {
                    marked: true,
                    dotColor: log.type === 'poop' ? getColor.secondary() : getColor.buttonBlue()
                };
            }
        });
        
        if (selectedDate) {
            markedDates[selectedDate] = {
                ...(markedDates[selectedDate] || { marked: true, dotColor: getColor.primary() }),
                selected: true,
                selectedColor: getColor.primary()
            };
        }
        
        return markedDates;
    };

    const handleDateSelect = (date: DateData): void => {
        setSelectedDate(date.dateString === selectedDate ? null : date.dateString);
    };

    const formatLogDetails = (log: WasteLog): string[] => {
        const details: string[] = [];

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

    const handleEditLog = (log: WasteLog): void => {
        router.push({
            pathname: '/(stack)/add-waste-log',
            params: {
                petId: route.params.petId,
                logId: log.id,
                isEditing: 'true'
            }
        });
    };

    const handleDeleteLog = async (logId: string): Promise<void> => {
        try {
            const pets = await loadPets();
            const updatedPet = pets.find(p => p.id === route.params.petId);
            
            if (updatedPet && (updatedPet as GuineaPig).wasteLogs) {
                (updatedPet as GuineaPig).wasteLogs = (updatedPet as GuineaPig).wasteLogs?.filter((log: WasteLog) => log.id !== logId);
                await savePets(pets);
                setLogs((updatedPet as GuineaPig).wasteLogs || []);
                Alert.alert('Success', 'Waste log deleted successfully');
            }
        } catch {
            Alert.alert('Error', 'Failed to delete waste log. Please try again.');
        }
    };

    const renderLog = ({ item }: { item: WasteLog }): JSX.Element => (
        <View key={`${item.date}-${item.type}-${item.id}`} style={styles.recordItem}>
            <View style={styles.recordHeader}>
                <View style={styles.logTypeContainer}>
                    <MaterialIcons
                        name={item.type === 'poop' ? 'wc' : 'water-drop'}
                        size={24}
                        color={item.type === 'poop' ? getColor.secondary() : getColor.buttonBlue()}
                    />
                    <Text style={styles.recordType}>
                        {item.type === 'poop' ? 'Poop' : 'Pee'}
                    </Text>
                </View>
                <View style={styles.logActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditLog(item)}
                    >
                        <MaterialIcons name="edit" size={20} color={getColor.primary()} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteLog(item.id)}
                    >
                        <MaterialIcons name="delete" size={20} color={getColor.error()} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                {formatLogDetails(item).map((detail) => (
                    <Text key={`${item.id}-detail-${detail}`} style={styles.recordNotes}>
                        {detail}
                    </Text>
                ))}
            </View>

            {item.notes && (
                <Text style={styles.recordNotes}>Notes: {item.notes}</Text>
            )}
        </View>
    );

    const addNewLog = (): void => {
        router.push({
            pathname: '/(stack)/add-waste-log',
            params: {
                petId: route.params.petId
            }
        });
    };

    const typeOptions = [
        { value: 'poop', label: 'Poop', icon: 'check-circle', color: '#4CAF50' },
        { value: 'pee', label: 'Pee', icon: 'check-circle', color: '#4CAF50' },
        { value: 'soft', label: 'Soft', icon: 'warning', color: '#FF9800' },
        { value: 'hard', label: 'Hard', icon: 'error', color: '#F44336' },
        { value: 'diarrhea', label: 'Diarrhea', icon: 'error-outline', color: '#E91E63' },
        { value: 'none', label: 'None', icon: 'remove-circle', color: '#9E9E9E' }
    ];

    const amountOptions = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
    ];

    const colorOptions = [
        'Brown', 'Dark Brown', 'Light Brown', 'Green', 'Yellow', 'Black', 'Red'
    ];

    const handleAddRecord = (): void => {
        if (newRecord.type && newRecord.amount && newRecord.color) {
            const record: WasteLog = {
                id: Date.now().toString(),
                date: newRecord.date || new Date().toISOString().split('T')[0],
                time: newRecord.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: newRecord.type,
                amount: newRecord.amount,
                color: newRecord.color,
                notes: newRecord.notes,
                petId: route.params.petId,
                frequency: 1,
                frequencyType: 'per_day',
                location: ''
            };
            setLogs([...logs, record]);
            setNewRecord({
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'poop',
                amount: 'medium',
                color: 'Brown',
                notes: ''
            });
            setIsAddingRecord(false);
        } else {
            Alert.alert('Error', 'Please fill in all required fields');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title="Waste Log" />
            
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Waste Tracking</Text>
                    <Text style={styles.subtitle}>Monitor your pet's digestive health</Text>
                </View>

                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handleDateSelect}
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
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 13
                        }}
                    />
                </View>

                {selectedDate && (
                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDateText}>
                            Records for {new Date(selectedDate).toLocaleDateString()}
                        </Text>
                        <TouchableOpacity
                            style={styles.clearDateButton}
                            onPress={() => setSelectedDate(null)}
                        >
                            <MaterialIcons name="clear" size={20} color={getColor.textSecondary()} />
                        </TouchableOpacity>
                    </View>
                )}

                <FlatList
                    data={filteredLogs}
                    renderItem={renderLog}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons name="monitor" size={48} color={getColor.textSecondary()} />
                            <Text style={styles.emptyText}>
                                {selectedDate ? 'No waste records for this date' : 'No waste records yet'}
                            </Text>
                            <Text style={styles.emptySubtext}>
                                Tap the + button to add a waste record
                            </Text>
                        </View>
                    }
                />

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={addNewLog}
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
                                <Text style={styles.modalTitle}>Add Waste Record</Text>
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
                                <Text style={styles.inputLabel}>Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newRecord.time}
                                    onChangeText={(text) => setNewRecord({ ...newRecord, time: text })}
                                    placeholder="HH:MM"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Type *</Text>
                                <View style={styles.typeGrid}>
                                    {typeOptions.map((type) => (
                                        <TouchableOpacity
                                            key={type.value}
                                            style={[
                                                styles.typeOption,
                                                newRecord.type === type.value && styles.selectedType
                                            ]}
                                            onPress={() => setNewRecord({ ...newRecord, type: type.value as WasteLog['type'] })}
                                        >
                                            <MaterialIcons 
                                                name={type.icon as keyof typeof MaterialIcons.glyphMap} 
                                                size={20} 
                                                color={newRecord.type === type.value ? getColor.white() : type.color} 
                                            />
                                            <Text style={[
                                                styles.typeOptionText,
                                                newRecord.type === type.value && styles.selectedTypeText
                                            ]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Amount *</Text>
                                <View style={styles.amountGrid}>
                                    {amountOptions.map((amount) => (
                                        <TouchableOpacity
                                            key={amount.value}
                                            style={[
                                                styles.amountOption,
                                                newRecord.amount === amount.value && styles.selectedAmount
                                            ]}
                                            onPress={() => setNewRecord({ ...newRecord, amount: amount.value as WasteLog['amount'] })}
                                        >
                                            <Text style={[
                                                styles.amountOptionText,
                                                newRecord.amount === amount.value && styles.selectedAmountText
                                            ]}>
                                                {amount.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Color *</Text>
                                <View style={styles.colorGrid}>
                                    {colorOptions.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorOption,
                                                newRecord.color === color && styles.selectedColor
                                            ]}
                                            onPress={() => setNewRecord({ ...newRecord, color: color as WasteLog['color'] })}
                                        >
                                            <Text style={[
                                                styles.colorOptionText,
                                                newRecord.color === color && styles.selectedColorText
                                            ]}>
                                                {color}
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
                                    placeholder="Any additional notes"
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
        padding: 16,
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
        marginBottom: 16,
    },
    calendarContainer: {
        backgroundColor: getColor.white(),
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: getColor.white(),
        borderWidth: 1,
        borderColor: getColor.border(),
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
    },
    clearDateButton: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: getColor.background(),
    },
    listContent: {
        padding: 12,
    },
    recordItem: {
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
        marginBottom: 12,
    },
    logTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    recordType: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
    },
    logActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: getColor.background(),
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: getColor.background(),
    },
    detailsContainer: {
        marginBottom: 8,
    },
    recordNotes: {
        fontSize: 14,
        color: getColor.textSecondary(),
        marginBottom: 4,
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
        backgroundColor: getColor.modalOverlay(),
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
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 8,
    },
    input: {
        backgroundColor: getColor.white(),
        borderWidth: 1,
        borderColor: getColor.border(),
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: getColor.text(),
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: getColor.background(),
        borderWidth: 1,
        borderColor: getColor.border(),
    },
    selectedType: {
        backgroundColor: getColor.primary(),
        borderColor: getColor.primary(),
    },
    typeOptionText: {
        marginLeft: 4,
        fontSize: 14,
        color: getColor.text(),
    },
    selectedTypeText: {
        color: getColor.white(),
        fontWeight: '500',
    },
    amountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amountOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: getColor.background(),
        borderWidth: 1,
        borderColor: getColor.border(),
    },
    selectedAmount: {
        backgroundColor: getColor.primary(),
        borderColor: getColor.primary(),
    },
    amountOptionText: {
        fontSize: 14,
        color: getColor.text(),
    },
    selectedAmountText: {
        color: getColor.white(),
        fontWeight: '500',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: getColor.background(),
        borderWidth: 1,
        borderColor: getColor.border(),
    },
    selectedColor: {
        backgroundColor: getColor.primary(),
        borderColor: getColor.primary(),
    },
    colorOptionText: {
        fontSize: 14,
        color: getColor.text(),
    },
    selectedColorText: {
        color: getColor.white(),
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: getColor.background(),
        borderWidth: 1,
        borderColor: getColor.border(),
    },
    saveButton: {
        backgroundColor: getColor.primary(),
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.white(),
    },
});

export default WasteLogScreen; 