import AppHeader from '@/components/AppHeader';
import colors, { getColor } from '@/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'symptom' | 'vet' | 'note';
  value: string;
  notes: string;
}

type HealthTabType = 'weight' | 'symptom' | 'vet' | 'note';

const HealthTrackerScreen: React.FC = (): JSX.Element => {
  const params = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<HealthTabType>('weight');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({});
  const [notes, setNotes] = useState('');
  const insets = useSafeAreaInsets();

  // Load records when component mounts
  useEffect(() => {
    const loadRecords = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(`@guineapal_health_records_${params.petId}`);
        if (saved) setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load records', e);
      }
    };
    loadRecords();
  }, [params.petId]);

  // Save records whenever they change
  useEffect(() => {
    AsyncStorage.setItem(`@guineapal_health_records_${params.petId}`, JSON.stringify(records));
  }, [records, params.petId]);

  const addRecord = (): void => {
    if (!newRecord.value) return;
    const newHealthRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: selectedTab,
      value: newRecord.value,
      notes: notes,
    };
    setRecords([newHealthRecord, ...records]);
    setNewRecord({});
    setNotes('');
  };

  const renderItem = ({ item }: { item: HealthRecord }): JSX.Element => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.recordHeader}>
          <MaterialCommunityIcons
            name={
              item.type === 'weight' ? 'scale' :
              item.type === 'symptom' ? 'alert-circle' : 'medical-bag'
            }
            size={24}
            color={colors.brown}
          />
          <Text style={styles.recordDate}>{item.date}</Text>
        </View>
        <Text style={styles.recordValue}>{item.value}</Text>
        {item.notes ? <Text style={styles.recordNotes}>Notes: {item.notes}</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Health Tracker" />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'weight' && styles.activeTab]}
          onPress={() => setSelectedTab('weight')}
        >
          <MaterialCommunityIcons name="scale" size={24} color={colors.brown} />
          <Text>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'symptom' && styles.activeTab]}
          onPress={() => setSelectedTab('symptom')}
        >
          <MaterialCommunityIcons name="alert-circle" size={24} color={colors.brown} />
          <Text>Symptoms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'vet' && styles.activeTab]}
          onPress={() => setSelectedTab('vet')}
        >
          <MaterialCommunityIcons name="medical-bag" size={24} color={colors.brown} />
          <Text>Vet Visits</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          label={selectedTab === 'weight' ? 'Weight (g)' : selectedTab === 'symptom' ? 'Symptom' : 'Vet Visit Details'}
          value={newRecord.value}
          onChangeText={(value) => setNewRecord({ ...newRecord, value })}
          style={styles.input}
          keyboardType={selectedTab === 'weight' ? 'numeric' : 'default'}
        />
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          multiline
        />
        <Button
          mode="contained"
          onPress={addRecord}
          style={styles.button}
        >
          <Text>Add Record</Text>
        </Button>
      </View>

      <FlatList
        data={records.filter(record => record.type === selectedTab)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: getColor.transparent(),
  },
  activeTab: {
    borderBottomColor: colors.brown,
  },
  form: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: getColor.background(),
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.brown,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: getColor.cardBackground(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    marginLeft: 8,
    color: getColor.textLight(),
  },
  recordValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: getColor.text(),
  },
  recordNotes: {
    color: getColor.textLight(),
    fontStyle: 'italic',
  },
});

export default HealthTrackerScreen;