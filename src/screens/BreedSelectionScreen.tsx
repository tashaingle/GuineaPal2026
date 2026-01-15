import AppHeader from '@/components/AppHeader';
import { GUINEA_PIG_BREEDS } from '@/constants/breeds';
import { useBreed, type Breed } from '@/contexts/BreedContext';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ColorValue,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Breed type not needed - using string

const BreedSelectionScreen = (): JSX.Element => {
  const router = useRouter();
  const { setSelectedBreed } = useBreed();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredBreeds = GUINEA_PIG_BREEDS.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBreedSelect = (breedName: string): void => {
    const breed: Breed = {
      id: breedName.toLowerCase().replace(/\s+/g, '-'),
      name: breedName,
      description: `${breedName} guinea pig breed`,
      characteristics: ['Friendly', 'Active'],
      careLevel: 'medium',
      lifespan: '5-7 years',
      size: 'medium',
    };
    setSelectedBreed(breed);
    router.back();
  };

  const containerStyle: StyleProp<ViewStyle> = [styles.container, { paddingTop: insets.top }];
  const searchContainerStyle: StyleProp<ViewStyle> = [styles.searchContainer, { backgroundColor: getColor.background() as ColorValue }];
  const searchInputStyle: StyleProp<TextStyle> = [styles.searchInput, { color: getColor.text() as ColorValue }];
  const breedItemStyle: StyleProp<ViewStyle> = [styles.breedItem, { backgroundColor: getColor.background() as ColorValue }];
  const breedTextStyle: StyleProp<TextStyle> = [styles.breedText, { color: getColor.text() as ColorValue }];
  const emptyTextStyle: StyleProp<TextStyle> = [styles.emptyText, { color: getColor.text() as ColorValue }];
  const emptySubtextStyle: StyleProp<TextStyle> = [styles.emptySubtext, { color: getColor.textSecondary() as ColorValue }];

  return (
    <View style={containerStyle}>
      <AppHeader title="Select Breed" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={searchContainerStyle}>
          <MaterialIcons name="search" size={24} color={getColor.textSecondary() as ColorValue} style={styles.searchIcon} />
          <TextInput
            style={searchInputStyle}
            placeholder="Search breeds..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={getColor.textSecondary() as ColorValue}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <MaterialIcons name="clear" size={20} color={getColor.textSecondary() as ColorValue} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredBreeds}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={breedItemStyle}
              onPress={() => handleBreedSelect(item)}
            >
              <Text style={breedTextStyle}>
                {item}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={getColor.text() as ColorValue} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={getColor.textSecondary() as ColorValue} />
              <Text style={emptyTextStyle}>No breeds found</Text>
              <Text style={emptySubtextStyle}>Try a different search term</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.background() as ColorValue,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: getColor.background() as ColorValue,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  breedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breedText: {
    flex: 1,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BreedSelectionScreen;