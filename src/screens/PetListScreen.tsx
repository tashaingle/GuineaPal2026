import BannerAdComponent from '@/components/ads/BannerAdComponent';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { usePets } from '../contexts/PetContext';
import { getColor } from '../theme/colors';
import { GuineaPig } from '../types/guineaPig';
// Pet type not needed - using GuineaPig

export default function PetListScreen(): JSX.Element {
  const router = useRouter();
  const { pets, loading, error } = usePets();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    }
  }, [error]);

  const handleAddPet = (): void => {
    router.push('/(stack)/add-edit-pet');
  };

  const handleEditPet = (pet: GuineaPig): void => {
    router.push({
      pathname: '/(stack)/profile',
      params: { petId: pet.id }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: getColor.backgroundLight() }]}>
        <Text style={{ color: getColor.text() }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColor.backgroundLight() }]}>
      <AppHeader title="My Guinea Pigs" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.card}
              onPress={() => handleEditPet(pet as GuineaPig)}
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
              <MaterialIcons name="add" size={32} color={getColor.primary()} />
              <Text style={styles.addText}>Add New Pet</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Banner Ad */}
        <BannerAdComponent style={styles.bannerAd} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 12,
    shadowColor: getColor.cardShadow(),
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
    backgroundColor: getColor.backgroundLight(),
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  },
  addCard: {
    width: '48%',
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 12,
    shadowColor: getColor.cardShadow(),
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
    backgroundColor: getColor.white(),
    borderRadius: 8,
    gap: 8,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  },
  bannerAd: {
    marginTop: 12,
  },
}); 