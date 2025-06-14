import AppHeader from '@/components/AppHeader';
import { GuineaPig, PeeColor, PoopColor, PoopConsistency, WasteLog } from '@/navigation/types';
import colors from '@/theme/colors';
import { loadPets, savePets } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const POOP_CONSISTENCIES: PoopConsistency[] = ['normal', 'soft', 'wet', 'dry', 'diarrhea'];
const POOP_COLORS: PoopColor[] = ['brown', 'dark_brown', 'green', 'white', 'red', 'black'];
const PEE_COLORS: PeeColor[] = ['clear', 'cloudy', 'dark_yellow', 'orange', 'red', 'brown'];
const PEE_VOLUMES: ('normal' | 'excessive' | 'reduced')[] = ['normal', 'excessive', 'reduced'];

const AddWasteLogScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [type, setType] = useState<'poop' | 'pee'>('poop');
    const [frequency, setFrequency] = useState('1');
    const [frequencyType, setFrequencyType] = useState<'per_hour' | 'per_day'>('per_day');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [poopConsistency, setPoopConsistency] = useState<PoopConsistency>('normal');
    const [poopColor, setPoopColor] = useState<PoopColor>('brown');
    const [peeColor, setPeeColor] = useState<PeeColor>('clear');
    const [peeVolume, setPeeVolume] = useState<'normal' | 'excessive' | 'reduced'>('normal');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [existingLog, setExistingLog] = useState<WasteLog | null>(null);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        const loadExistingLog = async () => {
            if (params.logId && params.isEditing === 'true') {
                try {
                    const pets = await loadPets();
                    const pet = pets.find(p => p.id === params.petId);
                    if (!pet) return;

                    const log = pet.wasteLogs?.find(l => l.id === params.logId);
                    if (log) {
                        setExistingLog(log);
                        setIsEditing(true);
                        setType(log.type);
                        setFrequency(log.frequency.toString());
                        setFrequencyType(log.frequencyType);
                        setLocation(log.location || '');
                        setNotes(log.notes || '');
                        
                        if (log.type === 'poop') {
                            setPoopConsistency(log.poopConsistency || 'normal');
                            setPoopColor(log.poopColor || 'brown');
                        } else {
                            setPeeColor(log.peeColor || 'clear');
                            setPeeVolume(log.peeVolume || 'normal');
                        }
                    }
                } catch (error) {
                    console.error('Failed to load existing log:', error);
                    Alert.alert('Error', 'Failed to load existing log');
                }
            }
        };

        loadExistingLog();
    }, [params.logId, params.isEditing]);

    const handleSave = async () => {
        try {
            setIsLoading(true);

            const pets = await loadPets();
            const pet = pets.find(p => p.id === params.petId);

            if (!pet) {
                Alert.alert('Error', 'Pet not found');
                return;
            }

            const newLog: WasteLog = {
                id: existingLog?.id || Date.now().toString(),
                petId: pet.id,
                date: existingLog?.date || new Date().toISOString(),
                type,
                frequency: parseInt(frequency, 10),
                frequencyType,
                location,
                notes,
                ...(type === 'poop' ? {
                    poopConsistency,
                    poopColor,
                } : {
                    peeColor,
                    peeVolume,
                }),
            };

            const updatedPet: GuineaPig = {
                ...pet,
                wasteLogs: isEditing
                    ? (pet.wasteLogs || []).map(log => log.id === newLog.id ? newLog : log)
                    : [...(pet.wasteLogs || []), newLog],
            };

            const updatedPets = pets.map(p => p.id === pet.id ? updatedPet : p);
            await savePets(updatedPets);

            Alert.alert('Success', `Waste log ${isEditing ? 'updated' : 'saved'} successfully`, [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            console.error('Failed to save waste log:', error);
            Alert.alert('Error', 'Failed to save waste log');
        } finally {
            setIsLoading(false);
        }
    };

    const formatLabel = (value: string) => {
        return value.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <AppHeader title={isEditing ? 'Edit Waste Log' : 'Add Waste Log'} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Type</Text>
                    <RadioButton.Group onValueChange={value => setType(value as 'poop' | 'pee')} value={type}>
                        <View style={styles.row}>
                            <RadioButton.Item label="Poop" value="poop" />
                            <RadioButton.Item label="Pee" value="pee" />
                        </View>
                    </RadioButton.Group>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequency</Text>
                    <View style={styles.frequencyContainer}>
                        <TextInput
                            value={frequency}
                            onChangeText={setFrequency}
                            keyboardType="numeric"
                            style={[styles.input, styles.frequencyInput]}
                            mode="outlined"
                        />
                        <View style={styles.frequencyTypeContainer}>
                            <RadioButton.Group onValueChange={value => setFrequencyType(value as 'per_hour' | 'per_day')} value={frequencyType}>
                                <View style={styles.row}>
                                    <RadioButton.Item label="Per Hour" value="per_hour" />
                                    <RadioButton.Item label="Per Day" value="per_day" />
                                </View>
                            </RadioButton.Group>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        style={styles.input}
                        mode="outlined"
                        placeholder="e.g., Cage corner, Floor time area"
                    />
                </View>

                {type === 'poop' ? (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Consistency</Text>
                            <RadioButton.Group onValueChange={value => setPoopConsistency(value as PoopConsistency)} value={poopConsistency}>
                                {POOP_CONSISTENCIES.map(consistency => (
                                    <RadioButton.Item
                                        key={consistency}
                                        label={formatLabel(consistency)}
                                        value={consistency}
                                    />
                                ))}
                            </RadioButton.Group>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Color</Text>
                            <RadioButton.Group onValueChange={value => setPoopColor(value as PoopColor)} value={poopColor}>
                                {POOP_COLORS.map(color => (
                                    <RadioButton.Item
                                        key={color}
                                        label={formatLabel(color)}
                                        value={color}
                                    />
                                ))}
                            </RadioButton.Group>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Color</Text>
                            <RadioButton.Group onValueChange={value => setPeeColor(value as PeeColor)} value={peeColor}>
                                {PEE_COLORS.map(color => (
                                    <RadioButton.Item
                                        key={color}
                                        label={formatLabel(color)}
                                        value={color}
                                    />
                                ))}
                            </RadioButton.Group>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Volume</Text>
                            <RadioButton.Group onValueChange={value => setPeeVolume(value as 'normal' | 'excessive' | 'reduced')} value={peeVolume}>
                                {PEE_VOLUMES.map(volume => (
                                    <RadioButton.Item
                                        key={volume}
                                        label={formatLabel(volume)}
                                        value={volume}
                                    />
                                ))}
                            </RadioButton.Group>
                        </View>
                    </>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        style={styles.input}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        placeholder="Any additional observations..."
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.saveButton}
                >
                    {isEditing ? 'Update Log' : 'Save Log'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        padding: 16
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saveButton: {
        backgroundColor: '#5D4037',
    },
    section: {
        backgroundColor: colors.background.card,
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
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
    },
    frequencyContainer: {
        marginBottom: 12,
    },
    frequencyInput: {
        marginBottom: 8,
    },
    frequencyTypeContainer: {
        backgroundColor: 'white',
        borderRadius: 4,
        marginTop: 8,
    },
});

export default AddWasteLogScreen; 