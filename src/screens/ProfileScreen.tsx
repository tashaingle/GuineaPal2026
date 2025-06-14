import PetFeatureMenu from '@/components/PetFeatureMenu';
import { usePets } from '@/contexts/PetContext';
import { calculateAge, formatAge } from '@/utils/dateUtils';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GuineaPig } from '../types/guineaPig';

const ProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { petId } = params;
  const { pets, deletePet } = usePets();
  const [pet, setPet] = useState<GuineaPig | null>(pets.find(p => p.id === petId) || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Load fresh pet data when needed
  const refreshPetData = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const freshPet = pets.find(p => p.id === petId);
      if (!freshPet) {
        setError('Pet not found');
        Alert.alert('Error', 'Pet not found');
        router.back();
        return;
      }
      setPet(freshPet);
    } catch (error) {
      console.error('Failed to refresh pet data:', error);
      setError('Failed to load pet data');
      Alert.alert('Error', 'Failed to load pet data');
    } finally {
      setIsLoading(false);
    }
  }, [router, pets, petId]);

  // Refresh pet data when the screen comes into focus
  useEffect(() => {
    refreshPetData();
  }, [refreshPetData]);

  const handleDelete = useCallback(async () => {
    if (!petId) {
      Alert.alert('Error', 'Cannot delete pet: ID not found');
      return;
    }

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet?.name}? This action cannot be undone.`,
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
              await deletePet(petId);
              router.replace('/(stack)/pet-list');
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
  }, [router, pet?.name, petId, deletePet]);

  const handleEditPress = () => {
    if (!pet) return;
    router.push({
      pathname: '/(stack)/add-edit-pet',
      params: {
        mode: 'edit',
        petId: pet.id,
        name: pet.name,
        breed: pet.breed,
        birthDate: pet.birthDate,
        weight: pet.weight?.toString(),
        gender: pet.gender,
        isPregnant: pet.isPregnant?.toString(),
        pregnancyStartDate: pet.pregnancyStartDate
      }
    });
  };

  const handleFeaturePress = (feature: string) => {
    if (!pet) return;
    const currentPet = pet;

    switch (feature) {
      case 'weight-tracker':
        router.push(`/weight-tracker?petId=${currentPet.id}`);
        break;
      case 'medical-records':
        router.push(`/medical-records?petId=${currentPet.id}`);
        break;
      case 'mood-tracker':
        router.push(`/mood-tracker?petId=${currentPet.id}`);
        break;
      case 'diet-manager':
        router.push(`/diet-manager?petId=${currentPet.id}`);
        break;
      case 'waste-log':
        router.push(`/waste-log?petId=${currentPet.id}`);
        break;
      case 'family-tree':
        router.push({
          pathname: '/family-tree',
          params: {
            pet: JSON.stringify(currentPet)
          }
        });
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color="#5D4037" />
        </View>
      </View>
    );
  }

  if (error || !pet) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error || 'Pet not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshPetData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.header}>{pet.name}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <MaterialIcons name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={pet.image ? { uri: pet.image } : require('../../assets/images/default-pet.png')}
            style={styles.profileImage}
            contentFit="cover"
          />
          
          <View style={styles.infoContainer}>
            {pet.breed && (
              <View style={styles.infoRow}>
                <MaterialIcons name="pets" size={20} color="#5D4037" />
                <Text style={styles.infoText}>{pet.breed}</Text>
              </View>
            )}
            
            {pet.birthDate && (
              <View style={styles.infoRow}>
                <MaterialIcons name="cake" size={20} color="#5D4037" />
                <Text style={styles.infoText}>
                  {formatAge(calculateAge(pet.birthDate))}
                </Text>
              </View>
            )}

            {pet.gender && (
              <View style={styles.infoRow}>
                <MaterialIcons 
                  name={pet.gender === 'male' ? 'person' : pet.gender === 'female' ? 'person-outline' : 'help'} 
                  size={20} 
                  color="#5D4037" 
                />
                <Text style={styles.infoText}>
                  {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                  {pet.gender === 'female' && pet.isPregnant ? ' (Pregnant)' : ''}
                </Text>
              </View>
            )}

            {pet.isPregnant && pet.expectedDueDate && (
              <View style={styles.infoRow}>
                <MaterialIcons name="event" size={20} color="#5D4037" />
                <Text style={styles.infoText}>
                  Due Date: {new Date(pet.expectedDueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Care & Health</Text>
          <PetFeatureMenu pet={pet} onFeaturePress={handleFeaturePress} />
        </View>
      </ScrollView>
    </View>
  );
};

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#5D4037',
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;