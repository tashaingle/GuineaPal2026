import AppHeader from '@/components/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { FAB as Fab, Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../theme/colors';

interface GuineaGramPost {
  id: string;
  image: string;
  date: string;
  caption?: string;
}

const GuineaGramScreen: React.FC = (): JSX.Element => {
  const [posts, setPosts] = useState<GuineaGramPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<GuineaGramPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (): Promise<void> => {
    try {
      const savedPosts = await AsyncStorage.getItem('guineagram_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPost: GuineaGramPost = {
          id: Date.now().toString(),
          image: result.assets[0].uri,
          caption: '',
          date: new Date().toISOString(),
        };

        const updatedPosts = [newPost, ...posts];
        await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo');
    }
  };

  const handleDeletePost = async (id: string): Promise<void> => {
    try {
      const updatedPosts = posts.filter(post => post.id !== id);
      await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const handleSaveNote = async (): Promise<void> => {
    if (selectedPost) {
      try {
        const updatedPosts = posts.map(post =>
          post.id === selectedPost.id
            ? { ...post, caption: noteText }
            : post
        );
        await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        setSelectedPost({ ...selectedPost, caption: noteText });
        setIsEditingNote(false);
      } catch (error) {
        console.error('Error saving note:', error);
        Alert.alert('Error', 'Failed to save note');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={getColor.primary()} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AppHeader title="GuineaGram" />

        <ScrollView style={styles.gridContainer}>
          <View style={styles.grid}>
            {posts.map(post => (
              <TouchableOpacity
                key={post.id}
                style={styles.gridItem}
                onPress={() => setSelectedPost(post)}
              >
                <RNImage
                  source={{ uri: post.image }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Modal
          visible={!!selectedPost}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setSelectedPost(null);
            setIsEditingNote(false);
          }}
        >
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => {
                setSelectedPost(null);
                setIsEditingNote(false);
              }}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalDate}>
                  {selectedPost && new Date(selectedPost.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    style={styles.noteButton}
                    onPress={() => {
                      if (selectedPost) {
                        setNoteText(selectedPost.caption || '');
                        setIsEditingNote(true);
                      }
                    }}
                  >
                    <MaterialIcons name="note-add" size={24} color={getColor.background()} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (selectedPost) {
                        Alert.alert(
                          'Delete Photo',
                          'Are you sure you want to delete this photo?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel'
                            },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: (): void => {
                                handleDeletePost(selectedPost.id);
                                setSelectedPost(null);
                                setIsEditingNote(false);
                              }
                            }
                          ]
                        );
                      }
                    }}
                  >
                    <MaterialIcons name="delete" size={24} color={getColor.background()} />
                  </TouchableOpacity>
                </View>
              </View>
              {isEditingNote ? (
                <View style={styles.noteContainer}>
                  <TextInput
                    style={styles.noteInput}
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Add a note..."
                    placeholderTextColor={getColor.textLight()}
                    multiline
                    autoFocus
                  />
                  <View style={styles.noteButtons}>
                    <TouchableOpacity
                      style={[styles.noteButton, styles.cancelButton]}
                      onPress={() => {
                        setIsEditingNote(false);
                        setNoteText('');
                      }}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.noteButton, styles.saveButton]}
                      onPress={handleSaveNote}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              {selectedPost && (
                <TouchableOpacity
                  style={styles.expandedImage}
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedPost(null);
                    setIsEditingNote(false);
                  }}
                >
                  <RNImage
                    source={{ uri: selectedPost.image }}
                    style={styles.expandedImage}
                    resizeMode="contain"
                  />
                  {selectedPost.caption ? (
                    <View style={styles.captionOverlay}>
                      <Text style={styles.captionText}>{selectedPost.caption}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        <Fab
          icon="camera"
          style={styles.fab}
          onPress={handleAddPhoto}
          color={getColor.background()}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  gridContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  gridItem: {
    width: (Dimensions.get('window').width - 32) / 3,
    aspectRatio: 1,
    padding: 4,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: getColor.primary(),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: getColor.overlay(),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDate: {
    color: getColor.background(),
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: getColor.primary(),
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: getColor.buttonRed(),
    borderRadius: 8,
  },
  noteContainer: {
    padding: 16,
    backgroundColor: getColor.overlay(),
  },
  noteInput: {
    backgroundColor: getColor.background(),
    borderRadius: 8,
    padding: 12,
    color: getColor.text(),
    minHeight: 100,
    textAlignVertical: 'top',
  },
  noteButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: getColor.buttonOrange(),
  },
  saveButton: {
    backgroundColor: getColor.buttonGreen(),
  },
  buttonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  expandedImage: {
    flex: 1,
    marginTop: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: getColor.overlay(),
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
  },
  captionText: {
    color: getColor.white(),
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GuineaGramScreen;