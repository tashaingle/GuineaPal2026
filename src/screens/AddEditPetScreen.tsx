import { GUINEA_PIG_BREEDS, GUINEA_PIG_NAMES } from '@/constants/breeds';
import { usePets } from '@/contexts/PetContext';
import colors from '@/theme/colors';
import { Gender, GuineaPig } from '@/types/guineaPig';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GENDER_OPTIONS: { label: string; value: Gender; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: 'Male', value: 'male', icon: 'person' },
  { label: 'Female', value: 'female', icon: 'person-outline' },
  { label: 'Unknown', value: 'unknown', icon: 'help' }
];

const BACKGROUND_COLOR = '#FFF8E1';
const WHITE = '#FFFFFF';
const BORDER_COLOR = '#E0E0E0';

const AddEditPetScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pets, addPet, updatePet } = usePets();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState(params.mode as 'add' | 'edit');
  const [petId, setPetId] = useState(params.petId as string);
  const pet = mode === 'edit' ? pets.find(p => p.id === petId) : null;

  const [name, setName] = useState(params.name || pet?.name || '');
  const [breed, setBreed] = useState(params.breed || pet?.breed || '');
  const [birthDate, setBirthDate] = useState(params.birthDate || pet?.birthDate || '');
  const [weight, setWeight] = useState(params.weight || pet?.weight?.toString() || '');
  const [gender, setGender] = useState<Gender>(() => {
    if (params.gender && (params.gender === 'male' || params.gender === 'female' || params.gender === 'unknown')) {
      return params.gender as Gender;
    }
    if (pet?.gender && (pet.gender === 'male' || pet.gender === 'female' || pet.gender === 'unknown')) {
      return pet.gender;
    }
    return 'unknown';
  });
  const [isPregnant, setIsPregnant] = useState(params.isPregnant === 'true' || pet?.isPregnant || false);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(params.pregnancyStartDate || pet?.pregnancyStartDate || '');
  const [image, setImage] = useState<string | undefined>(params.image || pet?.image || undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'birthDate' | 'pregnancyDate'>('birthDate');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showPregnancyModal, setShowPregnancyModal] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [expectedDueDate, setExpectedDueDate] = useState<string>(pet?.expectedDueDate || '');

  const onComplete = params.onComplete ? JSON.parse(params.onComplete as string) as () => void : undefined;

  const { deletePet } = usePets();

  useEffect(() => {
    if (pregnancyStartDate) {
      const startDate = new Date(pregnancyStartDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 70); // Average 70 days gestation
      const dueDateString = dueDate.toISOString().split('T')[0];
      if (dueDateString) {
        setExpectedDueDate(dueDateString);
      }
    }
  }, [pregnancyStartDate]);

  useEffect(() => {
    if (selectedBreed) {
      setBreed(selectedBreed);
    }
  }, [selectedBreed]);

  useEffect(() => {
    if (params) {
      if (params.name !== undefined) setName(params.name as string);
      if (params.birthDate !== undefined) setBirthDate(params.birthDate as string);
      if (params.weight !== undefined) setWeight(params.weight as string);
      if (params.gender !== undefined) {
        const genderValue = params.gender as Gender;
        if (genderValue === 'male' || genderValue === 'female' || genderValue === 'unknown') {
          setGender(genderValue);
        }
      }
      if (params.isPregnant !== undefined) setIsPregnant(params.isPregnant === 'true');
      if (params.pregnancyStartDate !== undefined) setPregnancyStartDate(params.pregnancyStartDate as string);
      if (params.image !== undefined) setImage(params.image as string);
      if (params.mode !== undefined) setMode(params.mode as 'add' | 'edit');
      if (params.petId !== undefined) setPetId(params.petId as string);
    }
  }, [params]);

  useEffect(() => {
    if (params.gender && (params.gender === 'male' || params.gender === 'female' || params.gender === 'unknown')) {
      setGender(params.gender as Gender);
    }
  }, [params.gender]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add a pet photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      if (datePickerMode === 'birthDate') {
        setBirthDate(formattedDate);
      } else {
        setPregnancyStartDate(formattedDate);
      }
    }
  };

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    setShowBreedModal(false);
  };

  const handleGenderSelect = (selectedGender: Gender) => {
    console.log('Selected gender:', selectedGender);
    if (selectedGender === 'male' || selectedGender === 'female' || selectedGender === 'unknown') {
      setGender(selectedGender);
      setShowGenderModal(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your guinea pig');
      return;
    }

    if (!selectedBreed) {
      Alert.alert('Error', 'Please select a breed');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select a gender');
      return;
    }

    try {
      setIsLoading(true);
      const newPet: GuineaPig = {
        id: mode === 'edit' && petId ? petId : await Crypto.randomUUID(),
        name: name.trim(),
        breed: selectedBreed,
        birthDate: birthDate || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        image: image || undefined,
        gender,
        createdAt: mode === 'edit' && pet?.createdAt ? pet.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPregnant: isPregnant || false,
        pregnancyStartDate: pregnancyStartDate || undefined,
        expectedDueDate: expectedDueDate || undefined,
      };

      console.log('Saving pet:', newPet);

      if (mode === 'edit' && petId) {
        await updatePet(newPet);
      } else {
        await addPet(newPet);
      }

      // Wait a moment to ensure the pet is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      if (onComplete) {
        onComplete();
      }

      // Navigate back to pet list
      router.replace('/(stack)/pet-list');
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Error', 'Failed to save pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pet?.id) {
      Alert.alert('Error', 'Cannot delete pet: ID not found');
      return;
    }

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
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
              setIsLoading(true);
              await deletePet(pet.id);
              if (onComplete) {
                onComplete();
              }
              router.back();
            } catch (err) {
              console.error('Failed to delete pet:', err);
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    if (Platform.OS === 'ios') {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalButton}
                >
                  <Text style={[styles.modalButtonText, { color: colors.primary.DEFAULT }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={datePickerMode === 'birthDate' ? new Date(birthDate || Date.now()) : new Date(pregnancyStartDate || Date.now())}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <DateTimePicker
        value={datePickerMode === 'birthDate' ? new Date(birthDate || Date.now()) : new Date(pregnancyStartDate || Date.now())}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    );
  };

  const generateRandomName = () => {
    const randomIndex = Math.floor(Math.random() * GUINEA_PIG_NAMES.length);
    setName(GUINEA_PIG_NAMES[randomIndex]);
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleImagePick} style={styles.imageButton}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.petImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <MaterialIcons name="add-a-photo" size={32} color={colors.text.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Name</Text>
              <View style={styles.nameInputContainer}>
                <RNTextInput
                  style={[styles.input, { flex: 1 }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter pet's name"
                  placeholderTextColor={colors.text.secondary}
                />
                <TouchableOpacity 
                  style={styles.sparkleButton}
                  onPress={() => setShowNameSuggestions(!showNameSuggestions)}
                >
                  <MaterialIcons 
                    name="auto-awesome" 
                    size={24} 
                    color={showNameSuggestions ? colors.primary.DEFAULT : colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Breed</Text>
              <TouchableOpacity
                onPress={() => setShowBreedModal(true)}
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              >
                <Text style={styles.inputText}>
                  {selectedBreed || 'Select breed'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(true)}
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              >
                <Text style={styles.inputText}>
                  {GENDER_OPTIONS.find(option => option.value === gender)?.label || 'Select gender'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Birth Date</Text>
              <TouchableOpacity
                onPress={() => {
                  setDatePickerMode('birthDate');
                  setShowDatePicker(true);
                }}
                style={styles.input}
              >
                <Text style={styles.inputText}>
                  {birthDate ? formatDate(birthDate) : 'Select birth date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weight (g)</Text>
              <RNTextInput
                value={weight}
                onChangeText={setWeight}
                style={[styles.input, { height: 50 }]}
                placeholder="Enter weight in grams"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pregnancy Status</Text>
              <TouchableOpacity
                onPress={() => setShowPregnancyModal(true)}
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              >
                <Text style={styles.inputText}>
                  {isPregnant ? 'Pregnant' : 'Not Pregnant'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {isPregnant && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pregnancy Start Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDatePickerMode('pregnancyDate');
                      setShowDatePicker(true);
                    }}
                    style={styles.input}
                  >
                    <Text style={styles.inputText}>
                      {pregnancyStartDate ? formatDate(pregnancyStartDate) : 'Select start date'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Expected Due Date</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>
                      {expectedDueDate ? formatDate(expectedDueDate) : 'Calculated after setting start date'}
                    </Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary.DEFAULT }]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          transparent={true}
          animationType="slide"
          visible={showGenderModal}
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowGenderModal(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Gender</Text>
                <TouchableOpacity
                  onPress={() => setShowGenderModal(false)}
                  style={styles.modalButton}
                >
                  <Text style={[styles.modalButtonText, { color: colors.primary.DEFAULT }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalOptions}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      gender === option.value && styles.modalOptionSelected
                    ]}
                    onPress={() => handleGenderSelect(option.value)}
                  >
                    <MaterialIcons
                      name={option.icon}
                      size={24}
                      color={gender === option.value ? colors.white : colors.text.primary}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        gender === option.value && styles.modalOptionTextSelected
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="slide"
          visible={showPregnancyModal}
          onRequestClose={() => setShowPregnancyModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowPregnancyModal(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Pregnancy Status</Text>
                <TouchableOpacity
                  onPress={() => setShowPregnancyModal(false)}
                  style={styles.modalButton}
                >
                  <Text style={[styles.modalButtonText, { color: colors.primary.DEFAULT }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalOptions}>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    isPregnant && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setIsPregnant(true);
                    setShowPregnancyModal(false);
                  }}
                >
                  <MaterialIcons
                    name="pregnant-woman"
                    size={24}
                    color={isPregnant ? colors.white : colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      isPregnant && styles.modalOptionTextSelected
                    ]}
                  >
                    Pregnant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    !isPregnant && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setIsPregnant(false);
                    setPregnancyStartDate('');
                    setShowPregnancyModal(false);
                  }}
                >
                  <MaterialIcons
                    name="not-interested"
                    size={24}
                    color={!isPregnant ? colors.white : colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      !isPregnant && styles.modalOptionTextSelected
                    ]}
                  >
                    Not Pregnant
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showDatePicker && renderDatePicker()}

        {showBreedModal && (
          <Modal
            visible={showBreedModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBreedModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Breed</Text>
                  <TouchableOpacity
                    onPress={() => setShowBreedModal(false)}
                    style={styles.closeButton}
                  >
                    <MaterialIcons name="close" size={24} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.breedList}>
                  {GUINEA_PIG_BREEDS.map((breed) => (
                    <TouchableOpacity
                      key={breed}
                      style={[
                        styles.breedItem,
                        selectedBreed === breed && styles.selectedBreed
                      ]}
                      onPress={() => handleBreedSelect(breed)}
                    >
                      <Text style={[
                        styles.breedText,
                        selectedBreed === breed && styles.selectedBreedText
                      ]}>
                        {breed}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

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
              {GUINEA_PIG_NAMES.slice(0, 5).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
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
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  modalOptions: {
    padding: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: colors.white,
    marginBottom: 8,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary.DEFAULT,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text.primary,
  },
  modalOptionTextSelected: {
    color: colors.white,
  },
  breedList: {
    padding: 16,
  },
  breedItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  selectedBreed: {
    backgroundColor: colors.primary.DEFAULT,
  },
  selectedBreedText: {
    color: colors.white,
  },
  breedText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  nameSuggestionsContainer: {
    padding: 16,
  },
  generateButton: {
    backgroundColor: colors.primary.DEFAULT,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  suggestionsList: {
    padding: 16,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleButton: {
    padding: 8,
  },
});

export default AddEditPetScreen;