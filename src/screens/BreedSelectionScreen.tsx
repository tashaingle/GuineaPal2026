import AppHeader from '@/components/AppHeader';
import { GUINEA_PIG_BREEDS } from '@/constants/breeds';
import { Colors } from '@/constants/Colors';
import { useBreed } from '@/context/BreedContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BreedSelectionScreen = () => {
  const router = useRouter();
  const { setSelectedBreed } = useBreed();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const filteredBreeds = GUINEA_PIG_BREEDS.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Select Breed" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
          <MaterialIcons name="search" size={24} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search breeds..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <MaterialIcons name="clear" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredBreeds}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.breedItem,
                { backgroundColor: theme.background }
              ]}
              onPress={() => handleBreedSelect(item)}
            >
              <Text style={[styles.breedText, { color: theme.text }]}>
                {item}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color="#BDBDBD" />
              <Text style={[styles.emptyText, { color: theme.text }]}>No breeds found</Text>
              <Text style={[styles.emptySubtext, { color: theme.tabIconDefault }]}>Try a different search term</Text>
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
    backgroundColor: '#FFF8E1',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
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
    shadowColor: '#000',
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