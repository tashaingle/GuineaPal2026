import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { GuineaPig } from '@/types/guineaPig';

import { loadPets } from '@/utils/petStorage';
import { getFamilyTree, storeFamilyTree } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FamilyMember {
  id: string;
  name: string;
  relationship: 'parent' | 'sibling' | 'offspring' | 'mate';
  gender: 'male' | 'female' | 'unknown';
  birthDate?: string;
  notes?: string;
  petId?: string; // Add petId to link to actual pet
}

interface FamilyTreeScreenProps {
  route?: {
    params?: {
      pet?: GuineaPig;
      onUpdate?: () => void;
    };
  };
}

type RelationshipType = 'all' | FamilyMember['relationship'];

const FamilyTreeScreen: React.FC<FamilyTreeScreenProps> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipType>('all');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [availablePets, setAvailablePets] = useState<GuineaPig[]>([]);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    relationship: 'sibling',
    gender: 'unknown',
    birthDate: '',
    notes: '',
    petId: ''
  });
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [showEditPetSelector, setShowEditPetSelector] = useState(false);

  // Get the current pet from route params if available
  const currentPet = route?.params?.pet;

  const relationships = [
    { key: 'all', label: 'All', icon: 'family-restroom' },
    { key: 'parent', label: 'Parent', icon: 'elderly' },
    { key: 'sibling', label: 'Sibling', icon: 'people' },
    { key: 'offspring', label: 'Offspring', icon: 'child-care' },
    { key: 'mate', label: 'Mate', icon: 'favorite' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male', icon: 'male' },
    { value: 'female', label: 'Female', icon: 'female' },
    { value: 'unknown', label: 'Unknown', icon: 'help' }
  ];

  useEffect(() => {
    const loadPetsData = async (): Promise<void> => {
      try {
        const loadedPets = await loadPets();
        setPets(loadedPets);
      } catch {
        Alert.alert('Error', 'Failed to load pets. Please try again.');
      }
    };
    
    loadPetsData();
    loadFamilyMembers();
  }, []);

  useEffect(() => {
    if (isAddingMember) {
      loadAvailablePets(); // Update available pets when modal opens
    }
  }, [isAddingMember, pets]);

  const loadAvailablePets = async (): Promise<void> => {
    try {
      // Filter out the current pet if one is specified
      const filteredPets = currentPet 
        ? pets.filter(pet => pet.id !== currentPet.id)
        : pets;
      
      setAvailablePets(filteredPets);
    } catch {
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    }
  };

  const loadFamilyMembers = async (): Promise<void> => {
    try {
      if (!currentPet) return;
      
      const familyTree = await getFamilyTree(currentPet.id);
      if (familyTree && familyTree.members) {
        // Convert the stored FamilyMember format to our local format
        const convertedMembers = familyTree.members.map(member => ({
          id: member.id,
          name: member.name,
          relationship: member.relationship || 'sibling' as const, // Use stored relationship or default to sibling
          gender: (member.gender === 'male' ? 'male' : member.gender === 'female' ? 'female' : 'unknown') as 'male' | 'female' | 'unknown',
          birthDate: member.birthDate,
          notes: member.notes,
          petId: member.petId || '' // Use stored petId or default to empty
        }));
        setFamilyMembers(convertedMembers);
      }
    } catch {
      // Handle error silently
    }
  };

  const handleAddMember = async (): Promise<void> => {
    if (newMember.name && newMember.relationship && newMember.gender) {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name: newMember.name,
        relationship: newMember.relationship,
        gender: newMember.gender,
        birthDate: newMember.birthDate,
        notes: newMember.notes,
        petId: newMember.petId
      };
      
      const updatedMembers = [...familyMembers, member];
      setFamilyMembers(updatedMembers);
      
      // Save to storage
      try {
        if (!currentPet) {
          Alert.alert('Error', 'Current pet not found');
          return;
        }
        
        const familyTree = {
          members: updatedMembers.map(member => ({
            id: member.id,
            name: member.name,
            relationship: member.relationship,
            gender: (member.gender === 'male' ? 'male' : 'female') as 'male' | 'female',
            birthDate: member.birthDate,
            notes: member.notes,
            petId: member.petId,
            parents: [],
            children: [],
            partner: undefined
          })),
          lastUpdated: new Date().toISOString()
        };
        await storeFamilyTree(familyTree, currentPet.id);
      } catch {
        Alert.alert('Error', 'Failed to save family member. Please try again.');
      }
      
      setNewMember({
        name: '',
        relationship: 'sibling',
        gender: 'unknown',
        birthDate: '',
        notes: '',
        petId: ''
      });
      setIsAddingMember(false);
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const handlePetSelect = (pet: GuineaPig): void => {
    setNewMember({
      ...newMember,
      name: pet.name,
      gender: pet.gender,
      petId: pet.id
    });
    setShowPetSelector(false);
  };

  const handleEditPetSelect = (pet: GuineaPig): void => {
    if (editingMember) {
      setEditingMember({
        ...editingMember,
        name: pet.name,
        gender: pet.gender,
        petId: pet.id
      });
    }
    setShowEditPetSelector(false);
  };

  const handleEditMember = (member: FamilyMember): void => {
    setEditingMember(member);
    setIsEditingMember(true);
  };

  const handleUpdateMember = async (): Promise<void> => {
    if (editingMember && editingMember.name && editingMember.relationship && editingMember.gender) {
      const updatedMembers = familyMembers.map(member => 
        member.id === editingMember.id ? editingMember : member
      );
      setFamilyMembers(updatedMembers);
      
      // Save to storage
      try {
        if (!currentPet) {
          Alert.alert('Error', 'Current pet not found');
          return;
        }
        
        const familyTree = {
          members: updatedMembers.map(member => ({
            id: member.id,
            name: member.name,
            relationship: member.relationship,
            gender: (member.gender === 'male' ? 'male' : 'female') as 'male' | 'female',
            birthDate: member.birthDate,
            notes: member.notes,
            petId: member.petId,
            parents: [],
            children: [],
            partner: undefined
          })),
          lastUpdated: new Date().toISOString()
        };
        await storeFamilyTree(familyTree, currentPet.id);
      } catch {
        Alert.alert('Error', 'Failed to update family member. Please try again.');
      }
      
      setEditingMember(null);
      setIsEditingMember(false);
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const handleDeleteMember = (member: FamilyMember): void => {
    Alert.alert(
      'Delete Family Member',
      `Are you sure you want to delete ${member.name} from the family tree?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const updatedMembers = familyMembers.filter(m => m.id !== member.id);
            setFamilyMembers(updatedMembers);
            
            // Save to storage
            try {
              if (!currentPet) {
                Alert.alert('Error', 'Current pet not found');
                return;
              }
              
              const familyTree = {
                members: updatedMembers.map(m => ({
                  id: m.id,
                  name: m.name,
                  relationship: m.relationship,
                  gender: (m.gender === 'male' ? 'male' : 'female') as 'male' | 'female',
                  birthDate: m.birthDate,
                  notes: m.notes,
                  petId: m.petId,
                  parents: [],
                  children: [],
                  partner: undefined
                })),
                lastUpdated: new Date().toISOString()
              };
              await storeFamilyTree(familyTree, currentPet.id);
            } catch {
              Alert.alert('Error', 'Failed to delete family member. Please try again.');
            }
          }
        }
      ]
    );
  };

  const filteredMembers = familyMembers.filter(member => {
    if (selectedRelationship === 'all') return true;
    return member.relationship === selectedRelationship;
  });

  const renderFamilyMember = ({ item }: { item: FamilyMember }): JSX.Element => {
    const relationship = relationships.find(r => r.key === item.relationship);
    const gender = genderOptions.find(g => g.value === item.gender);
    
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <View style={styles.relationshipTag}>
              <MaterialIcons name={relationship?.icon as keyof typeof MaterialIcons.glyphMap} size={16} color={getColor.white()} />
              <Text style={styles.relationshipText}>{relationship?.label}</Text>
            </View>
          </View>
          <View style={styles.memberActions}>
            <MaterialIcons 
              name={gender?.icon as keyof typeof MaterialIcons.glyphMap} 
              size={24} 
              color={item.gender === 'male' ? getColor.primary() : item.gender === 'female' ? getColor.error() : getColor.textSecondary()} 
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMember(item)}
            >
              <MaterialIcons name="edit" size={20} color={getColor.primary()} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteMember(item)}
            >
              <MaterialIcons name="delete" size={20} color={getColor.error()} />
            </TouchableOpacity>
          </View>
        </View>
        {item.birthDate && (
          <Text style={styles.memberBirthDate}>Birth: {item.birthDate}</Text>
        )}
        {item.notes && (
          <Text style={styles.memberNotes}>{item.notes}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Family Tree" />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {currentPet ? `${currentPet.name}'s Family Tree` : 'Family Tree'}
          </Text>
          <Text style={styles.subtitle}>
            {currentPet 
              ? `Track ${currentPet.name}'s family relationships` 
              : 'Track your pet\'s family relationships'
            }
          </Text>
          
          <View style={styles.relationshipTabs}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relationshipTabsContent}
            >
              {relationships.map((rel) => (
                <TouchableOpacity
                  key={rel.key}
                  style={[
                    styles.relationshipTab,
                    selectedRelationship === rel.key && styles.activeRelationshipTab
                  ]}
                  onPress={() => setSelectedRelationship(rel.key as RelationshipType)}
                >
                  <MaterialIcons 
                    name={rel.icon as keyof typeof MaterialIcons.glyphMap} 
                    size={20} 
                    color={selectedRelationship === rel.key ? getColor.white() : getColor.textSecondary()} 
                  />
                  <Text style={[
                    styles.relationshipTabText,
                    selectedRelationship === rel.key && styles.activeRelationshipTabText
                  ]}>
                    {rel.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          

        </View>

        <FlatList
          data={filteredMembers}
          renderItem={renderFamilyMember}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="family-restroom" size={48} color={getColor.textSecondary()} />
              <Text style={styles.emptyText}>No family members yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add a family member
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingMember(true)}
        >
          <MaterialIcons name="add" size={24} color={getColor.white()} />
        </TouchableOpacity>

        <Modal
          visible={isAddingMember}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAddingMember(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Family Member</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsAddingMember(false)}
                >
                  <MaterialIcons name="close" size={24} color={getColor.text()} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Select Pet *</Text>
                <TouchableOpacity
                  style={styles.petSelector}
                  onPress={() => {
                    setShowPetSelector(!showPetSelector);
                  }}
                >
                  <Text style={styles.petSelectorText}>
                    {newMember.name ? newMember.name : 'Choose a pet from your pets'}
                  </Text>
                  <MaterialIcons 
                    name={showPetSelector ? "arrow-drop-up" : "arrow-drop-down"} 
                    size={24} 
                    color={getColor.textSecondary()} 
                  />
                </TouchableOpacity>
                
                {/* Dropdown Menu */}
                {showPetSelector && (
                  <View style={styles.dropdownContainer}>
                    {availablePets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handlePetSelect(pet);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {pet.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {availablePets.length === 0 && (
                      <Text style={styles.dropdownEmptyText}>
                        No pets available to select
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Relationship *</Text>
                <View style={styles.relationshipGrid}>
                  {relationships.slice(1).map((rel) => (
                    <TouchableOpacity
                      key={rel.key}
                      style={[
                        styles.relationshipOption,
                        newMember.relationship === rel.key && styles.selectedRelationship
                      ]}
                      onPress={() => setNewMember({ ...newMember, relationship: rel.key as FamilyMember['relationship'] })}
                    >
                      <MaterialIcons 
                        name={rel.icon as keyof typeof MaterialIcons.glyphMap} 
                        size={20} 
                        color={newMember.relationship === rel.key ? getColor.white() : getColor.textSecondary()} 
                      />
                      <Text style={[
                        styles.relationshipOptionText,
                        newMember.relationship === rel.key && styles.selectedRelationshipText
                      ]}>
                        {rel.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newMember.notes}
                  onChangeText={(text) => setNewMember({ ...newMember, notes: text })}
                  placeholder="Any additional notes about this family relationship"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddingMember(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddMember}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Edit Member Modal */}
        <Modal
          visible={isEditingMember}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditingMember(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Family Member</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsEditingMember(false)}
                >
                  <MaterialIcons name="close" size={24} color={getColor.text()} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Select Pet *</Text>
                <TouchableOpacity
                  style={styles.petSelector}
                  onPress={() => {
                    setShowEditPetSelector(!showEditPetSelector);
                  }}
                >
                  <Text style={styles.petSelectorText}>
                    {editingMember?.name ? editingMember.name : 'Choose a pet from your pets'}
                  </Text>
                  <MaterialIcons 
                    name={showEditPetSelector ? "arrow-drop-up" : "arrow-drop-down"} 
                    size={24} 
                    color={getColor.textSecondary()} 
                  />
                </TouchableOpacity>
                
                {/* Dropdown Menu */}
                {showEditPetSelector && (
                  <View style={styles.dropdownContainer}>
                    {availablePets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handleEditPetSelect(pet);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {pet.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {availablePets.length === 0 && (
                      <Text style={styles.dropdownEmptyText}>
                        No pets available to select
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Relationship *</Text>
                <View style={styles.relationshipGrid}>
                  {relationships.slice(1).map((rel) => (
                    <TouchableOpacity
                      key={rel.key}
                      style={[
                        styles.relationshipOption,
                        editingMember?.relationship === rel.key && styles.selectedRelationship
                      ]}
                      onPress={() => setEditingMember(editingMember ? { ...editingMember, relationship: rel.key as FamilyMember['relationship'] } : null)}
                    >
                      <MaterialIcons 
                        name={rel.icon as keyof typeof MaterialIcons.glyphMap} 
                        size={20} 
                        color={editingMember?.relationship === rel.key ? getColor.white() : getColor.textSecondary()} 
                      />
                      <Text style={[
                        styles.relationshipOptionText,
                        editingMember?.relationship === rel.key && styles.selectedRelationshipText
                      ]}>
                        {rel.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editingMember?.notes}
                  onChangeText={(text) => setEditingMember(editingMember ? { ...editingMember, notes: text } : null)}
                  placeholder="Any additional notes about this family relationship"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditingMember(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateMember}
                >
                  <Text style={styles.saveButtonText}>Update</Text>
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
    padding: 12,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: getColor.white(),
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: getColor.text(),
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: getColor.textSecondary(),
    marginBottom: 16,
  },
  relationshipTabs: {
    flexDirection: 'row',
    marginTop: 16,
  },
  relationshipTabsContent: {
    paddingHorizontal: 12,
  },
  relationshipTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: getColor.background(),
  },
  activeRelationshipTab: {
    backgroundColor: getColor.primary(),
  },
  relationshipTabText: {
    marginLeft: 4,
    fontSize: 14,
    color: getColor.textSecondary(),
  },
  activeRelationshipTabText: {
    color: getColor.white(),
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 100,
  },
  memberCard: {
    backgroundColor: getColor.white(),
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 4,
  },
  relationshipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColor.primary(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  relationshipText: {
    fontSize: 12,
    color: getColor.white(),
    marginLeft: 4,
    fontWeight: '500',
  },
  memberBirthDate: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 4,
  },
  memberNotes: {
    fontSize: 14,
    color: getColor.textSecondary(),
    fontStyle: 'italic',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: getColor.background(),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: getColor.textSecondary(),
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: getColor.primary(),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.modalOverlay(),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    backgroundColor: getColor.backgroundLight(),
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    zIndex: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: getColor.text(),
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  petSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    backgroundColor: getColor.background(),
  },
  petSelectorText: {
    fontSize: 16,
    color: getColor.text(),
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: getColor.background(),
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  selectedRelationship: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  relationshipOptionText: {
    marginLeft: 4,
    fontSize: 14,
    color: getColor.text(),
  },
  selectedRelationshipText: {
    color: getColor.white(),
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: getColor.text(),
    backgroundColor: getColor.background(),
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: getColor.backgroundLight(),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },
  dropdownItemText: {
    fontSize: 16,
    color: getColor.text(),
    fontWeight: '500',
    marginBottom: 4,
  },
  dropdownEmptyText: {
    fontSize: 16,
    color: getColor.textSecondary(),
    textAlign: 'center',
    padding: 12,
  },

});

export default FamilyTreeScreen; 