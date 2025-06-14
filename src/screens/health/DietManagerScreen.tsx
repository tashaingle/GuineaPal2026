import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { loadDiet, saveDiet } from '@/utils/petStorage';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FoodItem = {
    id: string;
    name: string;
    amount: string;
    frequency: string;
    notes?: string;
};

type Diet = {
    foodItems: FoodItem[];
    allergies: string[];
    favoriteFruits: string[];
    favoriteVegetables: string[];
};

export default function DietManagerScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [petId, setPetId] = useState<string>('');
    const [diet, setDiet] = useState<Diet>({
        foodItems: [],
        allergies: [],
        favoriteFruits: [],
        favoriteVegetables: []
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
    const [newItem, setNewItem] = useState<Partial<FoodItem>>({
        name: '',
        amount: '',
        frequency: '',
        notes: ''
    });
    const [showAllergiesModal, setShowAllergiesModal] = useState(false);
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const [newFavorite, setNewFavorite] = useState('');
    const [favoriteType, setFavoriteType] = useState<'fruits' | 'vegetables'>('fruits');

    useEffect(() => {
        const init = async () => {
            const pets = await loadPets();
            const currentPet = pets.find(p => p.id === route.params?.petId);
            if (currentPet) {
                setPetId(currentPet.id);
                const savedDiet = await loadDiet(currentPet.id);
                if (savedDiet) {
                    setDiet(savedDiet);
                }
            }
        };
        init();
    }, [route.params?.petId]);

    const handleSave = async () => {
        if (!newItem.name || !newItem.amount || !newItem.frequency) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const updatedItems = editingItem
            ? diet.foodItems.map(item => item.id === editingItem.id ? { ...newItem, id: item.id } as FoodItem : item)
            : [...diet.foodItems, { ...newItem, id: Date.now().toString() } as FoodItem];

        const updatedDiet = { ...diet, foodItems: updatedItems };
        setDiet(updatedDiet);
        await saveDiet(petId, updatedDiet);
        setShowAddModal(false);
        setEditingItem(null);
        setNewItem({ name: '', amount: '', frequency: '', notes: '' });
    };

    const handleDelete = async (itemId: string) => {
        Alert.alert(
            'Delete Food Item',
            'Are you sure you want to delete this food item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedItems = diet.foodItems.filter(item => item.id !== itemId);
                        const updatedDiet = { ...diet, foodItems: updatedItems };
                        setDiet(updatedDiet);
                        await saveDiet(petId, updatedDiet);
                    }
                }
            ]
        );
    };

    const handleAddAllergy = async () => {
        if (!newAllergy.trim()) return;
        const updatedAllergies = [...diet.allergies, newAllergy.trim()];
        const updatedDiet = { ...diet, allergies: updatedAllergies };
        setDiet(updatedDiet);
        await saveDiet(petId, updatedDiet);
        setNewAllergy('');
    };

    const handleRemoveAllergy = async (allergy: string) => {
        const updatedAllergies = diet.allergies.filter(a => a !== allergy);
        const updatedDiet = { ...diet, allergies: updatedAllergies };
        setDiet(updatedDiet);
        await saveDiet(petId, updatedDiet);
    };

    const handleAddFavorite = async () => {
        if (!newFavorite.trim()) return;
        const updatedFavorites = favoriteType === 'fruits'
            ? [...diet.favoriteFruits, newFavorite.trim()]
            : [...diet.favoriteVegetables, newFavorite.trim()];
        const updatedDiet = {
            ...diet,
            [favoriteType === 'fruits' ? 'favoriteFruits' : 'favoriteVegetables']: updatedFavorites
        };
        setDiet(updatedDiet);
        await saveDiet(petId, updatedDiet);
        setNewFavorite('');
    };

    const handleRemoveFavorite = async (item: string, type: 'fruits' | 'vegetables') => {
        const updatedFavorites = type === 'fruits'
            ? diet.favoriteFruits.filter(f => f !== item)
            : diet.favoriteVegetables.filter(f => f !== item);
        const updatedDiet = {
            ...diet,
            [type === 'fruits' ? 'favoriteFruits' : 'favoriteVegetables']: updatedFavorites
        };
        setDiet(updatedDiet);
        await saveDiet(petId, updatedDiet);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title="Diet Manager" />

            <ScrollView style={styles.content}>
                {/* Allergies Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Allergies</Text>
                        <TouchableOpacity onPress={() => setShowAllergiesModal(true)}>
                            <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagsContainer}>
                        {diet.allergies.map((allergy, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{allergy}</Text>
                                <TouchableOpacity onPress={() => handleRemoveAllergy(allergy)}>
                                    <MaterialIcons name="close" size={16} color={colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Favorite Fruits Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Favorite Fruits</Text>
                        <TouchableOpacity onPress={() => {
                            setFavoriteType('fruits');
                            setShowFavoritesModal(true);
                        }}>
                            <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagsContainer}>
                        {diet.favoriteFruits.map((fruit, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{fruit}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFavorite(fruit, 'fruits')}>
                                    <MaterialIcons name="close" size={16} color={colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Favorite Vegetables Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Favorite Vegetables</Text>
                        <TouchableOpacity onPress={() => {
                            setFavoriteType('vegetables');
                            setShowFavoritesModal(true);
                        }}>
                            <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagsContainer}>
                        {diet.favoriteVegetables.map((vegetable, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{vegetable}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFavorite(vegetable, 'vegetables')}>
                                    <MaterialIcons name="close" size={16} color={colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Add/Edit Food Item Modal */}
            {showAddModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingItem ? 'Edit Food Item' : 'Add Food Item'}
                        </Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Food Name"
                            value={newItem.name}
                            onChangeText={text => setNewItem(prev => ({ ...prev, name: text }))}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Amount (e.g., 1 cup, 100g)"
                            value={newItem.amount}
                            onChangeText={text => setNewItem(prev => ({ ...prev, amount: text }))}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Frequency (e.g., twice daily, every 4 hours)"
                            value={newItem.frequency}
                            onChangeText={text => setNewItem(prev => ({ ...prev, frequency: text }))}
                        />
                        
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Notes (optional)"
                            value={newItem.notes}
                            onChangeText={text => setNewItem(prev => ({ ...prev, notes: text }))}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowAddModal(false);
                                    setEditingItem(null);
                                    setNewItem({ name: '', amount: '', frequency: '', notes: '' });
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSave}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Add Allergy Modal */}
            {showAllergiesModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Allergy</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter allergy"
                            value={newAllergy}
                            onChangeText={setNewAllergy}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowAllergiesModal(false);
                                    setNewAllergy('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    handleAddAllergy();
                                    setShowAllergiesModal(false);
                                }}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Add Favorite Modal */}
            {showFavoritesModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Add Favorite {favoriteType === 'fruits' ? 'Fruit' : 'Vegetable'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter ${favoriteType === 'fruits' ? 'fruit' : 'vegetable'}`}
                            value={newFavorite}
                            onChangeText={setNewFavorite}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowFavoritesModal(false);
                                    setNewFavorite('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    handleAddFavorite();
                                    setShowFavoritesModal(false);
                                }}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT
    },
    content: {
        flex: 1,
        padding: 16
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.DEFAULT,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.light
    },
    tagText: {
        fontSize: 14,
        color: colors.text.primary,
        marginRight: 4
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 400
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 16
    },
    input: {
        backgroundColor: colors.background.DEFAULT,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 8
    },
    cancelButton: {
        backgroundColor: colors.background.DEFAULT,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT
    },
    saveButton: {
        backgroundColor: colors.primary.DEFAULT
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500'
    },
    saveButtonText: {
        color: colors.white
    }
}); 