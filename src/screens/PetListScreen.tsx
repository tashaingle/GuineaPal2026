import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePets } from '../contexts/PetContext';
import colors from '../theme/colors';
import { GuineaPig } from '../types/guineaPig';

export default function PetListScreen() {
  const router = useRouter();
  const { pets, loading, error, deletePet } = usePets();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    }
  }, [error]);

  const handleAddPet = () => {
    router.push('/(stack)/add-edit-pet');
  };

  const handleEditPet = (pet: GuineaPig) => {
    router.push({
      pathname: '/(stack)/profile',
      params: { petId: pet.id }
    });
  };

  const handleDeletePet = async (petId: string) => {
    Alert.alert(
      'Delete Guinea Pig',
      'Are you sure you want to delete this guinea pig? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(petId);
              Alert.alert('Success', 'Pet deleted successfully');
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
        <Text style={{ color: colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>My Guinea Pigs</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.card}
              onPress={() => handleEditPet(pet)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={pet.image ? { uri: pet.image } : require('@/assets/images/placeholder.png')}
                  style={styles.petImage}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addCard}
            onPress={handleAddPet}
          >
            <View style={styles.addCardContent}>
              <MaterialIcons name="add" size={32} color={colors.primary.DEFAULT} />
              <Text style={styles.addText}>Add New Pet</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.components.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: colors.background.elevated,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  addCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.components.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addCardContent: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: 8,
    gap: 8,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    textAlign: 'center',
  },
}); 