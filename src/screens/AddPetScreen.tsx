import AppHeader from '@/components/AppHeader';
import { GUINEA_PIG_BREEDS } from '@/constants/breeds';
import { usePet } from '@/context/PetContext';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

const GUINEA_PIG_COLORS = [
    'Black',
    'White',
    'Brown',
    'Cream',
    'Albino',
    'Grey',
    'Red',
    'Other'
] as const;

const GUINEA_PIG_NAMES = [
    // Food-inspired names
    'Pepper', 'Ginger', 'Cocoa', 'Mocha', 'Caramel', 'Honey', 'Cookie', 'Muffin', 'Pumpkin', 'Olive',
    // Nature-inspired names
    'Willow', 'Daisy', 'Sunny', 'Storm', 'River', 'Sky', 'Rain', 'Leaf', 'Flower', 'Meadow',
    // Cute/Adorable names
    'Pip', 'Pipkin', 'Pippin', 'Poppy', 'Peanut', 'Pudding', 'Pumpkin', 'Pixie', 'Pebbles', 'Panda',
    // Character-inspired names
    'Gizmo', 'Fuzzy', 'Fluffy', 'Furball', 'Fuzzball', 'Fuzzy Wuzzy', 'Fuzzy Bear', 'Fuzzy Face', 'Fuzzy Butt', 'Fuzzy Pants',
    // Unique names
    'Ziggy', 'Zephyr', 'Zorro', 'Zigzag', 'Zipper', 'Zesty', 'Zany', 'Zippy', 'Zesty', 'Zippy'
] as const;

interface DropdownProps {
    items: readonly string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    isVisible: boolean;
    onClose: () => void;
}

const AddPetScreen: React.FC = (): JSX.Element => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addPet } = usePet();
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);
    const [showBreedDropdown, setShowBreedDropdown] = useState(false);
    const [showColorDropdown, setShowColorDropdown] = useState(false);

    const pickImage = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const generateRandomName = (): void => {
        const randomIndex = Math.floor(Math.random() * GUINEA_PIG_NAMES.length);
        setName(GUINEA_PIG_NAMES[randomIndex]);
    };

    const handleDateChange = (event: { type: string }, selectedDate?: Date): void => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
    };

    const handleSave = async (): Promise<void> => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name for your guinea pig');
            return;
        }
        if (!breed.trim()) {
            Alert.alert('Error', 'Please select a breed for your guinea pig');
            return;
        }
        if (selectedColors.length === 0) {
            Alert.alert('Error', 'Please select at least one color for your guinea pig');
            return;
        }
        if (!birthdate) {
            Alert.alert('Error', 'Please select the birthdate of your guinea pig');
            return;
        }

        try {
            const newPet = {
                id: uuid.v4(),
                name: name.trim(),
                breed,
                colors: selectedColors,
                birthdate: birthdate.toISOString(),
                image: image || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await addPet(newPet);
            router.back();
        } catch {
            Alert.alert('Error', 'Failed to save guinea pig. Please try again.');
        }
    };

    const handleColorSelect = (color: string): void => {
        setSelectedColors(prev => {
            if (prev.includes(color)) {
                return prev.filter(c => c !== color);
            }
            return [...prev, color];
        });
    };

    const renderDropdown = ({ items, selectedValue, onSelect, isVisible, onClose }: DropdownProps): JSX.Element => (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={[styles.modalOverlay, { backgroundColor: getColor.overlay() }]}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdownList}>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.dropdownItem,
                                    selectedValue === item && styles.selectedItem
                                ]}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={[
                                    styles.dropdownItemText,
                                    selectedValue === item && styles.selectedItemText
                                ]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderColorDropdown = (): JSX.Element => (
        <Modal
            visible={showColorDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowColorDropdown(false)}
        >
            <TouchableOpacity
                style={[styles.modalOverlay, { backgroundColor: getColor.overlay() }]}
                activeOpacity={1}
                onPress={() => setShowColorDropdown(false)}
            >
                <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdownList}>
                        {GUINEA_PIG_COLORS.map((colorItem) => (
                            <TouchableOpacity
                                key={colorItem}
                                style={[
                                    styles.dropdownItem,
                                    selectedColors.includes(colorItem) && styles.selectedItem
                                ]}
                                onPress={() => handleColorSelect(colorItem)}
                            >
                                <Text style={[
                                    styles.dropdownItemText,
                                    selectedColors.includes(colorItem) && styles.selectedItemText
                                ]}>
                                    {colorItem}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title="Add Guinea Pig" />
            <ScrollView style={styles.content}>
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <MaterialIcons name="add-a-photo" size={32} color={getColor.textLight()} />
                            <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter name"
                                placeholderTextColor={getColor.textLight()}
                            />
                            <TouchableOpacity 
                                style={styles.nameGeneratorButton}
                                onPress={() => setShowNameSuggestions(!showNameSuggestions)}
                            >
                                <MaterialIcons 
                                    name="auto-awesome" 
                                    size={24} 
                                    color={getColor.primary()} 
                                />
                            </TouchableOpacity>
                        </View>
                        {showNameSuggestions && (
                            <View style={styles.nameSuggestionsContainer}>
                                <TouchableOpacity 
                                    style={styles.generateButton}
                                    onPress={generateRandomName}
                                >
                                    <Text style={styles.generateButtonText}>Generate Random Name</Text>
                                </TouchableOpacity>
                                <Text style={styles.suggestionsTitle}>Name Suggestions:</Text>
                                <View style={styles.suggestionsList}>
                                    {GUINEA_PIG_NAMES.slice(0, 5).map((suggestion) => (
                                        <TouchableOpacity
                                            key={suggestion}
                                            style={styles.suggestionItem}
                                            onPress={() => {
                                                setName(suggestion);
                                                setShowNameSuggestions(false);
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{suggestion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Breed</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowBreedDropdown(true)}
                        >
                            <Text style={[styles.inputText, !breed && { color: getColor.textLight() }]}>
                                {breed || 'Select breed'}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color={getColor.textLight()} />
                        </TouchableOpacity>
                        {renderDropdown({
                            items: GUINEA_PIG_BREEDS,
                            selectedValue: breed,
                            onSelect: setBreed,
                            isVisible: showBreedDropdown,
                            onClose: () => setShowBreedDropdown(false)
                        })}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Colours</Text>
                        <TouchableOpacity 
                            style={styles.colorInput}
                            onPress={() => setShowColorDropdown(true)}
                        >
                            <View style={styles.colorTagsContainer}>
                                {selectedColors.length > 0 ? (
                                    selectedColors.map((colorItem) => (
                                        <View key={colorItem} style={styles.colorTag}>
                                            <Text style={styles.colorTagText}>{colorItem}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleColorSelect(colorItem)}
                                                style={styles.colorTagRemove}
                                            >
                                                <MaterialIcons name="close" size={16} color={getColor.textLight()} />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={[styles.inputText, { color: getColor.textLight() }]}>
                                        Select colors
                                    </Text>
                                )}
                            </View>
                            <MaterialIcons name="arrow-drop-down" size={24} color={getColor.textLight()} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Birthdate</Text>
                        <TouchableOpacity 
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[styles.inputText, !birthdate && { color: getColor.textLight() }]}>
                                {birthdate ? format(birthdate, 'dd/MM/yyyy') : 'Select birthdate'}
                            </Text>
                            <MaterialIcons name="calendar-today" size={24} color={getColor.textLight()} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>

            {renderColorDropdown()}
            {showDatePicker && (
                <DateTimePicker
                    value={birthdate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
            {Platform.OS === 'ios' && showDatePicker && (
                <TouchableOpacity
                    style={styles.datePickerOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDatePicker(false)}
                >
                    <View style={styles.datePickerContainer}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={styles.datePickerDoneText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={birthdate || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: getColor.background(),
    },
    content: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: getColor.backgroundLight(),
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getColor.backgroundLight(),
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 16,
        color: getColor.textLight(),
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: getColor.borderLight(),
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: getColor.text(),
        backgroundColor: getColor.backgroundLight(),
    },
    inputText: {
        color: getColor.text(),
        fontSize: 16,
    },
    nameInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameGeneratorButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: getColor.borderLight(),
    },
    nameSuggestionsContainer: {
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    generateButton: {
        backgroundColor: getColor.primary(),
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    generateButtonText: {
        color: getColor.textLight(),
        fontSize: 16,
        fontWeight: '500',
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: getColor.text(),
        marginBottom: 8,
    },
    suggestionsList: {
        gap: 8,
    },
    suggestionItem: {
        padding: 12,
        backgroundColor: getColor.background(),
        borderRadius: 8,
    },
    suggestionText: {
        color: getColor.text(),
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: getColor.primary(),
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: getColor.textLight(),
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: getColor.overlay(),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 12,
        width: '80%',
        maxHeight: '80%',
    },
    dropdownList: {
        maxHeight: 300,
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: getColor.borderLight(),
    },
    selectedItem: {
        backgroundColor: getColor.primary(),
    },
    dropdownItemText: {
        fontSize: 16,
        color: getColor.text(),
    },
    selectedItemText: {
        color: getColor.textLight(),
    },
    colorInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
    colorTagsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getColor.primary(),
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    colorTagText: {
        color: getColor.textLight(),
        marginRight: 4,
    },
    colorTagRemove: {
        padding: 2,
    },
    datePickerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: getColor.overlay(),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    datePickerContainer: {
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 12,
        width: '90%',
        maxWidth: 400,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: getColor.borderLight(),
    },
    datePickerDoneText: {
        color: getColor.primary(),
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddPetScreen; 