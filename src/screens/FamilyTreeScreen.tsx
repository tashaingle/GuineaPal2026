import { GuineaPig } from '@/navigation/types';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    route: {
        params: {
            pet: GuineaPig;
            onUpdate?: () => void;
        };
    };
};

type RelationType = 'mother' | 'father' | 'mate' | 'sibling' | 'child';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 12,
  },
  relationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  relationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  relationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  relationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4037',
  },
  relationType: {
    fontSize: 14,
    color: '#795548',
  },
  addButton: {
    marginTop: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  selectionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4037',
    marginBottom: 4,
  },
  selectionDetails: {
    fontSize: 14,
    color: '#795548',
  },
});

// Add type guard for selectedRelationType
const getRelationTypeLabel = (type: string | null): string => {
  if (!type) return 'Select Relation';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const FamilyTreeScreen: React.FC<Props> = ({ route }) => {
  const router = useRouter();
  const { pet, onUpdate } = route.params;
  const [allPets, setAllPets] = useState<GuineaPig[]>([]);
  const [mother, setMother] = useState<GuineaPig | null>(null);
  const [father, setFather] = useState<GuineaPig | null>(null);
  const [siblings, setSiblings] = useState<GuineaPig[]>([]);
  const [children, setChildren] = useState<GuineaPig[]>([]);
  const [mate, setMate] = useState<GuineaPig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedRelationType, setSelectedRelationType] = useState<RelationType | null>(null);
  const [eligiblePets, setEligiblePets] = useState<GuineaPig[]>([]);
  const insets = useSafeAreaInsets();

  // Add a function to save the current pet's data
  const saveCurrentPetData = useCallback(async () => {
    try {
      const updatedPet = { ...pet };
      const updatedPets = allPets.map(p => {
        if (p.id === pet.id) return updatedPet;
        return p;
      });
      await savePets(updatedPets);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to save pet data:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  }, [pet, allPets, onUpdate]);

  // Add effect to save data when leaving the screen
  useEffect(() => {
    return () => {
      saveCurrentPetData();
    };
  }, [saveCurrentPetData]);

  const loadFamilyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const pets = await loadPets();
      setAllPets(pets);

      // Find family members
      const foundMother = pets.find(p => p.id === pet.motherId);
      const foundFather = pets.find(p => p.id === pet.fatherId);
      const foundMate = pets.find(p => p.id === pet.mate);
      const foundSiblings = pets.filter(p => 
        pet.siblings?.includes(p.id) || 
        (foundMother && p.motherId === foundMother.id && p.id !== pet.id) ||
        (foundFather && p.fatherId === foundFather.id && p.id !== pet.id)
      );
      const foundChildren = pets.filter(p => pet.children?.includes(p.id));

      setMother(foundMother || null);
      setFather(foundFather || null);
      setMate(foundMate || null);
      setSiblings(foundSiblings);
      setChildren(foundChildren);
    } catch (error) {
      console.error('Failed to load family data:', error);
      Alert.alert('Error', 'Failed to load family data');
    } finally {
      setIsLoading(false);
    }
  }, [pet]);

  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);

  const getEligiblePets = (relationType: RelationType) => {
    return allPets.filter(p => {
      if (p.id === pet.id) return false;
      
      switch (relationType) {
        case 'mother':
          return p.gender === 'female' && !mother;
        case 'father':
          return p.gender === 'male' && !father;
        case 'mate':
          return p.gender !== pet.gender && !mate;
        case 'sibling':
          return !siblings.some(s => s.id === p.id);
        case 'child':
          return !children.some(c => c.id === p.id);
        default:
          return false;
      }
    });
  };

  const handleAddRelation = async (relationType: RelationType) => {
    const eligible = getEligiblePets(relationType);
    if (eligible.length === 0) {
      Alert.alert('No Eligible Pets', 'No eligible guinea pigs found for this relationship.');
      return;
    }
    setEligiblePets(eligible);
    setSelectedRelationType(relationType);
    setShowSelectionModal(true);
  };

  const handleSelectPet = async (selectedPet: GuineaPig) => {
    try {
      if (!selectedRelationType) return;

      const updatedPet = { ...pet };
      const updatedSelectedPet = { ...selectedPet };

      switch (selectedRelationType) {
        case 'mother':
          updatedPet.motherId = selectedPet.id;
          updatedSelectedPet.children = [...(selectedPet.children || []), pet.id];
          setMother(selectedPet);
          break;
        case 'father':
          updatedPet.fatherId = selectedPet.id;
          updatedSelectedPet.children = [...(selectedPet.children || []), pet.id];
          setFather(selectedPet);
          break;
        case 'mate':
          updatedPet.mate = selectedPet.id;
          updatedSelectedPet.mate = pet.id;
          setMate(selectedPet);
          break;
        case 'sibling':
          updatedPet.siblings = [...(updatedPet.siblings || []), selectedPet.id];
          updatedSelectedPet.siblings = [...(updatedSelectedPet.siblings || []), pet.id];
          setSiblings(prev => [...prev, selectedPet]);
          break;
        case 'child':
          updatedPet.children = [...(updatedPet.children || []), selectedPet.id];
          if (pet.gender === 'female') {
            updatedSelectedPet.motherId = pet.id;
          } else if (pet.gender === 'male') {
            updatedSelectedPet.fatherId = pet.id;
          }
          setChildren(prev => [...prev, selectedPet]);
          break;
      }

      // Update both pets in the allPets array
      const updatedPets = allPets.map(p => {
        if (p.id === pet.id) return updatedPet;
        if (p.id === selectedPet.id) return updatedSelectedPet;
        return p;
      });

      // Save the updated pets to storage
      await savePets(updatedPets);
      
      // Update the local state
      setAllPets(updatedPets);
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }

      // Close the modal and reset the selection
      setShowSelectionModal(false);
      setSelectedRelationType(null);

      // Reload the family data to ensure everything is in sync
      await loadFamilyData();
    } catch (error) {
      console.error('Failed to add relation:', error);
      Alert.alert('Error', 'Failed to update family relationship');
    }
  };

  const handleRemoveRelation = async (relatedPetId: string, relationType: RelationType) => {
    try {
      const relatedPet = allPets.find(p => p.id === relatedPetId);
      if (!relatedPet) return;

      const updatedPet = { ...pet };
      const updatedRelatedPet = { ...relatedPet };

      switch (relationType) {
        case 'mother':
          updatedPet.motherId = undefined;
          updatedRelatedPet.children = updatedRelatedPet.children?.filter(id => id !== pet.id);
          setMother(null);
          break;
        case 'father':
          updatedPet.fatherId = undefined;
          updatedRelatedPet.children = updatedRelatedPet.children?.filter(id => id !== pet.id);
          setFather(null);
          break;
        case 'mate':
          updatedPet.mate = undefined;
          updatedRelatedPet.mate = undefined;
          setMate(null);
          break;
        case 'sibling':
          updatedPet.siblings = updatedPet.siblings?.filter(id => id !== relatedPetId);
          updatedRelatedPet.siblings = updatedRelatedPet.siblings?.filter(id => id !== pet.id);
          setSiblings(prev => prev.filter(s => s.id !== relatedPetId));
          break;
        case 'child':
          updatedPet.children = updatedPet.children?.filter(id => id !== relatedPetId);
          if (pet.gender === 'female') {
            updatedRelatedPet.motherId = undefined;
          } else if (pet.gender === 'male') {
            updatedRelatedPet.fatherId = undefined;
          }
          setChildren(prev => prev.filter(c => c.id !== relatedPetId));
          break;
      }

      const updatedPets = allPets.map(p => {
        if (p.id === pet.id) return updatedPet;
        if (p.id === relatedPet.id) return updatedRelatedPet;
        return p;
      });

      await savePets(updatedPets);
      setAllPets(updatedPets);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to remove relation:', error);
      Alert.alert('Error', 'Failed to remove family relationship');
    }
  };

  const renderPetCard = (relatedPet: GuineaPig, relation: string) => {
    const relationType = relation.toLowerCase() as RelationType;
    return (
      <View style={styles.relationCard}>
        <Image
          source={relatedPet.image ? { uri: relatedPet.image } : require('../../assets/images/default-pet.png')}
          style={styles.relationImage}
          contentFit="cover"
        />
        <View style={styles.relationInfo}>
          <Text style={styles.relationName}>{relatedPet.name}</Text>
          <Text style={styles.relationType}>{relation}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            Alert.alert(
              'Remove Relationship',
              `Are you sure you want to remove ${relatedPet.name} as ${pet.name}'s ${relation.toLowerCase()}?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => handleRemoveRelation(relatedPet.id, relationType)
                }
              ]
            );
          }}
        >
          <MaterialIcons name="close" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPetSelectionCard = (selectionPet: GuineaPig) => (
    <TouchableOpacity
      key={selectionPet.id}
      style={styles.selectionCard}
      onPress={() => handleSelectPet(selectionPet)}
    >
      <Image
        source={selectionPet.image ? { uri: selectionPet.image } : require('../../assets/images/default-pet.png')}
        style={styles.selectionImage}
        contentFit="cover"
      />
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionName}>{selectionPet.name}</Text>
        <Text style={styles.selectionDetails}>
          {selectionPet.breed ? `${selectionPet.breed} • ` : ''}
          {selectionPet.gender.charAt(0).toUpperCase() + selectionPet.gender.slice(1)}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#5D4037" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.title}>{pet.name}'s Family Tree</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parents</Text>
          {mother && renderPetCard(mother, 'Mother')}
          {!mother && (
            <Button
              mode="outlined"
              onPress={() => handleAddRelation('mother')}
              style={styles.addButton}
            >
              Add Mother
            </Button>
          )}
          {father && renderPetCard(father, 'Father')}
          {!father && (
            <Button
              mode="outlined"
              onPress={() => handleAddRelation('father')}
              style={styles.addButton}
            >
              Add Father
            </Button>
          )}
        </View>

        {pet.gender !== 'unknown' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mate</Text>
            {mate && renderPetCard(mate, 'Mate')}
            {!mate && (
              <Button
                mode="outlined"
                onPress={() => handleAddRelation('mate')}
                style={styles.addButton}
              >
                Add Mate
              </Button>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Siblings</Text>
          {siblings.map(sibling => (
            <React.Fragment key={sibling.id}>
              {renderPetCard(sibling, 'Sibling')}
            </React.Fragment>
          ))}
          <Button
            mode="outlined"
            onPress={() => handleAddRelation('sibling')}
            style={styles.addButton}
          >
            Add Sibling
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children</Text>
          {children.map(child => (
            <React.Fragment key={child.id}>
              {renderPetCard(child, 'Child')}
            </React.Fragment>
          ))}
          <Button
            mode="outlined"
            onPress={() => handleAddRelation('child')}
            style={styles.addButton}
          >
            Add Child
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={showSelectionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSelectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {`Select ${getRelationTypeLabel(selectedRelationType)}`}
            </Text>
            <ScrollView>
              {eligiblePets.map(renderPetSelectionCard)}
            </ScrollView>
            <Button
              mode="outlined"
              onPress={() => setShowSelectionModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FamilyTreeScreen; 