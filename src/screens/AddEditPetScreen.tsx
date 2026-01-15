import { GUINEA_PIG_BREEDS } from '@/constants/breeds';
import { usePets } from '@/contexts/PetContext';
import { getColor } from '@/theme/colors';
import { Gender, GuineaPig } from '@/types/guineaPig';
import { showInterstitialAd } from '@/utils/ads';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  View,
  useColorScheme,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
// Pet type not needed - using GuineaPig

const GENDER_OPTIONS: { label: string; value: Gender; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: 'Male', value: 'male', icon: 'person' },
  { label: 'Female', value: 'female', icon: 'person-outline' },
  { label: 'Unknown', value: 'unknown', icon: 'help' }
];

const AddEditPetScreen = (): JSX.Element => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pets, addPet, updatePet } = usePets();

  const [mode, setMode] = useState(params.mode as 'add' | 'edit');
  const [petId, setPetId] = useState(params.petId as string);
  const pet = mode === 'edit' ? pets.find(p => p.id === petId) : null;

  const [name, setName] = useState(params.name || pet?.name || '');
  const [selectedBreed, setSelectedBreed] = useState(params.breed || pet?.breed || '');
  const [birthDate, setBirthDate] = useState(params.birthDate || pet?.birthDate || '');
  const [weight, setWeight] = useState(params.weight || pet?.weight?.toString() || '');
 const [gender, setGender] = useState<Gender>(() => {
  const g = params.gender ?? pet?.gender;

  if (g === 'male' || g === 'female' || g === 'unknown') {
    return g as Gender;
  }

  return 'unknown';
});

  const [isPregnant, setIsPregnant] = useState(params.isPregnant === 'true' || (pet as GuineaPig)?.isPregnant || false);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(params.pregnancyStartDate || (pet as GuineaPig)?.pregnancyStartDate || '');
  const [image, setImage] = useState<string | undefined>(params.image || pet?.image || undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'birthDate' | 'pregnancyDate'>('birthDate');
  const closeDatePicker = () => setShowDatePicker(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [expectedDueDate, setExpectedDueDate] = useState<string>((pet as GuineaPig)?.expectedDueDate || '');
  const [pregnancyNotes, setPregnancyNotes] = useState<string>((pet as GuineaPig)?.pregnancyNotes || '');
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

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
      setSelectedBreed(selectedBreed);
    }
  }, [selectedBreed]);

useEffect(() => {
  if (!params) return;

  if (params.name !== undefined) setName(params.name as string);
  if (params.birthDate !== undefined) setBirthDate(params.birthDate as string);
  if (params.weight !== undefined) setWeight(params.weight as string);

  if (params.gender !== undefined) {
    const g = params.gender as Gender;
    if (g === 'male' || g === 'female' || g === 'unknown') {
      setGender(g);
    }
  }
}, [params]);

  const handleImagePick = async (): Promise<void> => {
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

  const handleDateChange = (event: unknown, selectedDate?: Date): void => {
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

  const handleSave = async (): Promise<void> => {
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
        gender: gender,
        birthDate: birthDate || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        image: image || undefined,
        isPregnant: isPregnant,
        pregnancyStartDate: pregnancyStartDate || undefined,
        expectedDueDate: expectedDueDate || undefined,
        pregnancyNotes: pregnancyNotes || undefined,
        createdAt: mode === 'edit' && pet?.createdAt ? pet.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (mode === 'edit' && petId) {
        await updatePet({
          ...newPet,
          species: 'guinea_pig',
          color: 'Unknown',
          isActive: true,
          gender: gender === 'unknown' ? 'male' : gender,
        });
      } else {
        await addPet({
          ...newPet,
          species: 'guinea_pig',
          color: 'Unknown',
          isActive: true,
          gender: gender === 'unknown' ? 'male' : gender,
        });
        // Show ad when adding a new pet
        try {
          await showInterstitialAd();
        } catch (adError) {
          console.warn('Failed to show interstitial ad:', adError);
          // Don't fail the pet creation if ad fails
        }
      }

      // Wait a moment to ensure the pet is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      if (onComplete) {
        onComplete();
      }

      // Navigate back to previous screen
      router.back();
    } catch (error) {
      console.error('Failed to save pet:', error);
      Alert.alert('Error', `Failed to save pet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
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
          onPress: async (): Promise<void> => {
            try {
              setIsLoading(true);
              await deletePet(pet.id);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

const renderDatePicker = (): JSX.Element => {
  if (!showDatePicker) return <></>;

  const value =
    datePickerMode === 'birthDate'
      ? new Date(birthDate || Date.now())
      : new Date(pregnancyStartDate || Date.now());

  // ANDROID
  if (Platform.OS === 'android') {
    return (
 
    );
  }

  // IOS
  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={closeDatePicker}
    >
      <View style={styles.dateModalOverlay}>
        <View style={[styles.dateModalSheet, { backgroundColor: isDark ? '#111' : '#fff' }]}>
          <View style={styles.dateModalHeader}>
            <TouchableOpacity onPress={closeDatePicker}>
              <Text style={[styles.dateModalButton, { color: isDark ? '#fff' : '#111' }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeDatePicker}>
              <Text style={[styles.dateModalButton, styles.dateModalButtonDone, { color: isDark ? '#4da3ff' : getColor.primary() }]}>
  Done
</Text>
            </TouchableOpacity>
          </View>




        </View>
      </View>
    </Modal>
  );
};



  const renderContent = (): JSX.Element => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.imageWrapper}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialIcons name="add-a-photo" size={32} color={getColor.textLight()} />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <RNTextInput
              style={[styles.input, { backgroundColor: getColor.inputBackground() }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter pet's name"
              placeholderTextColor={getColor.inputPlaceholder()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Breed</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowBreedModal(true)}
            >
              <Text style={styles.selectButtonText}>
                {selectedBreed || 'Select breed'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={getColor.text()} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={styles.selectButtonText}>
                {GENDER_OPTIONS.find(option => option.value === gender)?.label || 'Select gender'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={getColor.text()} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setDatePickerMode('birthDate');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.selectButtonText}>
                {birthDate || 'Select birth date'}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color={getColor.text()} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (g)</Text>
            <RNTextInput
              style={[styles.input, { backgroundColor: getColor.inputBackground() }]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              keyboardType="numeric"
              placeholderTextColor={getColor.inputPlaceholder()}
            />
          </View>

          {gender === 'female' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pregnancy Status</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setIsPregnant(!isPregnant)}
              >
                <Text style={styles.selectButtonText}>
                  {isPregnant ? 'Pregnant' : 'Not Pregnant'}
                </Text>
                <MaterialIcons
                  name={isPregnant ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={getColor.text()}
                />
              </TouchableOpacity>
            </View>
          )}

          {isPregnant && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pregnancy Start Date</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  setDatePickerMode('pregnancyDate');
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.selectButtonText}>
                  {pregnancyStartDate || 'Select start date'}
                </Text>
                <MaterialIcons name="calendar-today" size={24} color={getColor.text()} />
              </TouchableOpacity>
            </View>
          )}

          {isPregnant && pregnancyStartDate && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Due Date</Text>
              <Text style={styles.dueDateText}>{expectedDueDate}</Text>
            </View>
          )}

          {isPregnant && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pregnancy Notes</Text>
              <RNTextInput
                style={[styles.input, { backgroundColor: getColor.inputBackground() }]}
                value={pregnancyNotes}
                onChangeText={setPregnancyNotes}
                placeholder="Enter pregnancy notes"
                placeholderTextColor={getColor.inputPlaceholder()}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {mode === 'edit' && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text style={styles.deleteButtonText}>Delete Pet</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={getColor.background()} />
          ) : (
            <Text style={styles.saveButtonText}>
              {mode === 'edit' ? 'Save Changes' : 'Add Pet'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {renderDatePicker()}

      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={getColor.text()} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalOptions}>
              {GENDER_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    gender === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setGender(option.value);
                    setShowGenderModal(false);
                  }}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={24}
                    color={gender === option.value ? getColor.background() : getColor.text()}
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
        visible={showBreedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBreedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Breed</Text>
              <TouchableOpacity
                onPress={() => setShowBreedModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={getColor.text()} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.breedList}>
              {GUINEA_PIG_BREEDS.map(breed => (
                <TouchableOpacity
                  key={breed}
                  style={[
                    styles.breedItem,
                    selectedBreed === breed && styles.selectedBreed
                  ]}
                  onPress={() => {
                    setSelectedBreed(breed);
                    setShowBreedModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.breedText,
                      selectedBreed === breed && styles.selectedBreedText
                    ]}
                  >
                    {breed}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );

  return (
    <PaperProvider>
      {renderContent()}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: getColor.cardBackground(),
    borderWidth: 2,
    borderColor: getColor.border(),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getColor.backgroundLight(),
  },
  placeholderText: {
    marginTop: 8,
    color: getColor.textLight(),
    fontSize: 14,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  input: {
    backgroundColor: getColor.inputBackground(),
    borderRadius: 8,
    padding: 12,
    color: getColor.text(),
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: getColor.cardBackground(),
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  selectButtonText: {
    color: getColor.text(),
    fontSize: 16,
  },
  dueDateText: {
    color: getColor.text(),
    fontSize: 16,
    padding: 12,
    backgroundColor: getColor.cardBackground(),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: getColor.border(),
    backgroundColor: getColor.cardBackground(),
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: getColor.primary(),
  },
  saveButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: getColor.error(),
  },
  deleteButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.overlay(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: getColor.cardBackground(),
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
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
  modalOptions: {
    padding: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: getColor.primary(),
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: getColor.text(),
  },
  modalOptionTextSelected: {
    color: getColor.background(),
  },
  breedList: {
    maxHeight: 400,
  },
  breedItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },
  selectedBreed: {
    backgroundColor: getColor.backgroundLight(),
  },
  selectedBreedText: {
    color: getColor.primary(),
    fontWeight: '600',
  },
  breedText: {
    fontSize: 16,
    color: getColor.text(),
  },




  dateModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
dateModalSheet: {
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  paddingBottom: 24,
},


  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },
  dateModalButton: {
    fontSize: 16,
    color: getColor.text(),
  },
  dateModalButtonDone: {
    fontWeight: '600',
    color: getColor.primary(),
  },
});

export default AddEditPetScreen;