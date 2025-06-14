import AppHeader from '@/components/AppHeader';
import { RootStackParamList, WeightRecord } from '@/navigation/types';
import colors from '@/theme/colors';
import { deleteWeightRecord, loadWeightRecords, saveWeightRecord, updateWeightRecord } from '@/utils/petStorage';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WeightTrackerScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'weight-tracker'>>();
  const navigation = useNavigation<NavigationProp>();
  const { petId } = route.params;
  const [pet, setPet] = useState<{ id: string; name: string } | null>(null);

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pets, records] = await Promise.all([
        loadPets(),
        loadWeightRecords(petId)
      ]);
      const currentPet = pets.find(p => p.id === petId);
      if (!currentPet) {
        console.warn(`Pet with ID ${petId} not found, retrying...`);
        // Add a small delay and retry once
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryPets = await loadPets();
        const retryPet = retryPets.find(p => p.id === petId);
        if (!retryPet) {
          throw new Error('Pet not found');
        }
        setPet(retryPet);
      } else {
        setPet(currentPet);
      }
      setWeightRecords(records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Failed to load weight records:', error);
      Alert.alert('Error', 'Failed to load weight records. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    try {
      if (editingRecord) {
        const updatedRecord: WeightRecord = {
          ...editingRecord,
          weight: Number(newWeight),
          notes: notes.trim()
        };
        await updateWeightRecord(petId, updatedRecord);
        setWeightRecords(weightRecords.map(record => 
          record.id === updatedRecord.id ? updatedRecord : record
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else {
        const weightRecord: WeightRecord = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          weight: Number(newWeight),
          notes: notes.trim()
        };
        await saveWeightRecord(petId, weightRecord);
        setWeightRecords([...weightRecords, weightRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }
      setShowAddModal(false);
      setNewWeight('');
      setNotes('');
      setEditingRecord(null);
    } catch (error) {
      console.error('Failed to save weight record:', error);
      Alert.alert('Error', 'Failed to save weight record');
    }
  };

  const handleEditRecord = (record: WeightRecord) => {
    setEditingRecord(record);
    setNewWeight(record.weight.toString());
    setNotes(record.notes || '');
    setShowAddModal(true);
  };

  const handleDeleteRecord = async (record: WeightRecord) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this weight record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWeightRecord(petId, record.id);
              setWeightRecords(weightRecords.filter(r => r.id !== record.id));
            } catch (error) {
              console.error('Failed to delete weight record:', error);
              Alert.alert('Error', 'Failed to delete weight record');
            }
          }
        }
      ]
    );
  };

  const renderWeightRecord = ({ item }: { item: WeightRecord }) => (
    <TouchableOpacity 
      style={styles.recordItem}
      onPress={() => handleEditRecord(item)}
      onLongPress={() => handleDeleteRecord(item)}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.recordWeight}>{item.weight}g</Text>
      </View>
      {item.notes && (
        <Text style={styles.recordNotes}>{item.notes}</Text>
      )}
      <Text style={styles.editHint}>Tap to edit • Long press to delete</Text>
    </TouchableOpacity>
  );

  const handleDateChange = (event: any, selectedDate: any) => {
    const newDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(newDate);
  };

  const handleSave = () => {
    // Implement the logic to save the weight record
  };

  const chartData = {
    labels: weightRecords.map(record => 
      new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: weightRecords.map(record => parseFloat(record.weight.toString()))
    }]
  };

  const chartConfig = {
    backgroundColor: colors.background.card,
    backgroundGradientFrom: colors.background.card,
    backgroundGradientTo: colors.background.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(93, 64, 55, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(93, 64, 55, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary.DEFAULT
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader 
        title="Weight Tracker"
      />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" size={24} color={colors.background.card} />
          <Text style={styles.addButtonText}>Add Weight Record</Text>
        </TouchableOpacity>

        <View style={styles.chartContainer}>
          {weightRecords.length > 0 ? (
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Add weight records to see the chart</Text>
            </View>
          )}
        </View>

        <FlatList
          data={weightRecords}
          renderItem={renderWeightRecord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="monitor-weight" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No weight records yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add a weight record
              </Text>
            </View>
          }
        />

        <Modal
          visible={showAddModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Weight Record</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={newWeight}
                    onChangeText={setNewWeight}
                    keyboardType="decimal-pad"
                    placeholder="Enter weight"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: colors.text.primary }}>
                      {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any notes about this weight record"
                    placeholderTextColor={colors.text.secondary}
                    multiline
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleAddWeight}
                  >
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  content: {
    flex: 1,
    padding: 16
  },
  chartContainer: {
    marginBottom: 16
  },
  emptyChart: {
    height: 220,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  emptyChartText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center'
  },
  listContent: {
    padding: 16
  },
  recordItem: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  recordDate: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600'
  },
  recordWeight: {
    fontSize: 18,
    color: colors.primary.DEFAULT,
    fontWeight: 'bold'
  },
  recordNotes: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8
  },
  editHint: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background.DEFAULT
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12
  },
  cancelButton: {
    backgroundColor: colors.background.elevated
  },
  saveButton: {
    backgroundColor: colors.primary.DEFAULT
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary
  },
  saveButtonText: {
    color: colors.background.card
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.DEFAULT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: colors.background.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WeightTrackerScreen; 