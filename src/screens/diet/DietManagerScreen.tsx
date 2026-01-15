import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

interface FoodItem {
  id: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'hay' | 'pellets' | 'treats';
  frequency: 'daily' | 'weekly' | 'occasionally';
  amount: string;
  notes?: string;
}

type CategoryType = 'all' | FoodItem['category'];

const DietManagerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    category: 'vegetables',
    frequency: 'daily',
    amount: '',
    notes: ''
  });

  const categories = [
    { key: 'all', label: 'All', icon: 'restaurant' },
    { key: 'vegetables', label: 'Vegetables', icon: 'eco' },
    { key: 'fruits', label: 'Fruits', icon: 'local-florist' },
    { key: 'hay', label: 'Hay', icon: 'grass' },
    { key: 'pellets', label: 'Pellets', icon: 'grain' },
    { key: 'treats', label: 'Treats', icon: 'cake' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'occasionally', label: 'Occasionally' }
  ];

  const handleAddItem = (): void => {
    if (newItem.name && newItem.amount) {
      const item: FoodItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category || 'vegetables',
        frequency: newItem.frequency || 'daily',
        amount: newItem.amount,
        notes: newItem.notes
      };
      setFoodItems([...foodItems, item]);
      setNewItem({
        name: '',
        category: 'vegetables',
        frequency: 'daily',
        amount: '',
        notes: ''
      });
      setIsAddingItem(false);
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const filteredItems = foodItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const renderFoodItem = ({ item }: { item: FoodItem }): JSX.Element => (
    <View style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>
            {categories.find(c => c.key === item.category)?.label}
          </Text>
        </View>
      </View>
      <Text style={styles.foodAmount}>Amount: {item.amount}</Text>
      <Text style={styles.foodFrequency}>Frequency: {item.frequency}</Text>
      {item.notes && (
        <Text style={styles.foodNotes}>{item.notes}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Diet Manager" />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Diet Management</Text>
          <Text style={styles.subtitle}>Track your pet's food and feeding schedule</Text>
          
          <View style={styles.categoryTabs}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.key && styles.activeCategoryTab
                ]}
                onPress={() => setSelectedCategory(category.key as CategoryType)}
              >
                <MaterialIcons 
                  name={category.icon as keyof typeof MaterialIcons.glyphMap} 
                  size={20} 
                  color={selectedCategory === category.key ? getColor.white() : getColor.textSecondary()} 
                />
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category.key && styles.activeCategoryTabText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderFoodItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="restaurant" size={48} color={getColor.textSecondary()} />
              <Text style={styles.emptyText}>No food items yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add a food item
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingItem(true)}
        >
          <MaterialIcons name="add" size={24} color={getColor.white()} />
        </TouchableOpacity>

        <Modal
          visible={isAddingItem}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAddingItem(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Food Item</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsAddingItem(false)}
                >
                  <MaterialIcons name="close" size={24} color={getColor.text()} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Food Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newItem.name}
                  onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                  placeholder="e.g., Carrots, Timothy Hay"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryGrid}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryOption,
                        newItem.category === category.key && styles.selectedCategory
                      ]}
                      onPress={() => setNewItem({ ...newItem, category: category.key as FoodItem['category'] })}
                    >
                      <MaterialIcons 
                        name={category.icon as keyof typeof MaterialIcons.glyphMap} 
                        size={20} 
                        color={newItem.category === category.key ? getColor.white() : getColor.textSecondary()} 
                      />
                      <Text style={[
                        styles.categoryOptionText,
                        newItem.category === category.key && styles.selectedCategoryText
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Frequency</Text>
                <View style={styles.frequencyGrid}>
                  {frequencyOptions.map((freq) => (
                    <TouchableOpacity
                      key={freq.value}
                      style={[
                        styles.frequencyOption,
                        newItem.frequency === freq.value && styles.selectedFrequency
                      ]}
                      onPress={() => setNewItem({ ...newItem, frequency: freq.value as FoodItem['frequency'] })}
                    >
                      <Text style={[
                        styles.frequencyOptionText,
                        newItem.frequency === freq.value && styles.selectedFrequencyText
                      ]}>
                        {freq.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Amount *</Text>
                <TextInput
                  style={styles.input}
                  value={newItem.amount}
                  onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
                  placeholder="e.g., 1 cup, 2 tablespoons"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newItem.notes}
                  onChangeText={(text) => setNewItem({ ...newItem, notes: text })}
                  placeholder="Any additional notes about this food"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddingItem(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddItem}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
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
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 16,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColor.backgroundLight(),
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  activeCategoryTab: {
    backgroundColor: getColor.primary(),
  },
  categoryTabText: {
    fontSize: 12,
    color: getColor.textSecondary(),
  },
  activeCategoryTabText: {
    color: getColor.white(),
  },
  listContent: {
    padding: 12,
  },
  foodCard: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  categoryTag: {
    backgroundColor: getColor.primary(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: getColor.white(),
    fontWeight: '600',
  },
  foodAmount: {
    fontSize: 14,
    color: getColor.text(),
    marginBottom: 4,
  },
  foodFrequency: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 8,
  },
  foodNotes: {
    fontSize: 14,
    color: getColor.textSecondary(),
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  emptySubtext: {
    fontSize: 14,
    color: getColor.textSecondary(),
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: getColor.primary(),
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.overlay(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: getColor.white(),
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
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
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: getColor.text(),
    marginBottom: 8,
  },
  input: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: getColor.text(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedCategory: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  categoryOptionText: {
    fontSize: 14,
    color: getColor.text(),
  },
  selectedCategoryText: {
    color: getColor.white(),
  },
  frequencyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedFrequency: {
    backgroundColor: getColor.primary(),
    borderColor: getColor.primary(),
  },
  frequencyOptionText: {
    fontSize: 14,
    color: getColor.text(),
  },
  selectedFrequencyText: {
    color: getColor.white(),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  saveButton: {
    backgroundColor: getColor.primary(),
  },
  cancelButtonText: {
    color: getColor.text(),
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: getColor.white(),
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DietManagerScreen; 