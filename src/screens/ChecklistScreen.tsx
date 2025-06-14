import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { showInterstitialAd } from '@/utils/ads';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Checkbox } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ChecklistItem = {
  id: string;
  task: string;
  completed: boolean;
  timeOfDay: 'morning' | 'evening';
  date: string;
};

interface Task {
  id: string;
  tasks: string[];
  timeOfDay: 'morning' | 'evening';
  icon: keyof typeof MaterialIcons.glyphMap;
}

const tasks: Task[] = [
  {
    id: 'Morning Care',
    tasks: ['Fresh hay', 'Clean water', 'Morning veggies', 'Health check'],
    timeOfDay: 'morning',
    icon: 'wb-sunny'
  },
  {
    id: 'Evening Care',
    tasks: ['Fresh hay', 'Clean water', 'Evening veggies', 'Spot clean cage'],
    timeOfDay: 'evening',
    icon: 'nights-stay'
  },
  {
    id: 'Weekly Tasks',
    tasks: ['Deep clean cage', 'Weigh guinea pigs', 'Check supplies', 'Trim nails if needed'],
    timeOfDay: 'morning',
    icon: 'event'
  },
  {
    id: 'Daily Health Checks',
    tasks: ['Check weight', 'Monitor eating', 'Check for injuries', 'Note behavior changes'],
    timeOfDay: 'morning',
    icon: 'favorite'
  }
];

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
  };
}

const ChecklistScreen = () => {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0] as string;
  const [selectedDate, setSelectedDate] = useState<string>(() => today);
  const [markedDates, setMarkedDates] = useState<Record<string, { selected: boolean }>>(() => {
    const initialMarkedDates: Record<string, { selected: boolean }> = {};
    if (today) {
      initialMarkedDates[today] = { selected: true };
    }
    return initialMarkedDates;
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const loadChecklist = async () => {
    try {
      setIsLoading(true);
      const savedChecklist = await AsyncStorage.getItem(`@checklist_${selectedDate}`);
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      } else {
        setChecklist(createDefaultChecklist(selectedDate));
      }
    } catch (error) {
      setError('Failed to load checklist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, [selectedDate]);

  const createDefaultChecklist = (date: string): ChecklistItem[] => {
    return tasks.flatMap(taskGroup =>
      taskGroup.tasks.map(task => ({
        id: `${taskGroup.id}-${task}-${Date.now()}`,
        task,
        completed: false,
        timeOfDay: taskGroup.timeOfDay,
        date: date
      }))
    );
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedChecklist = checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setChecklist(updatedChecklist);
      await AsyncStorage.setItem(`@checklist_${selectedDate}`, JSON.stringify(updatedChecklist));

      // Count completed tasks
      const completedTasks = updatedChecklist.filter(item => item.completed).length;
      
      // Show ad after every 3 completed tasks
      if (completedTasks > 0 && completedTasks % 3 === 0) {
        try {
          await showInterstitialAd();
        } catch (adError) {
          // Log the error but don't affect the task completion
          console.warn('Failed to show ad:', adError);
        }
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const resetChecklist = async () => {
    try {
      const resetList = checklist.map(item => ({ ...item, completed: false }));
      setChecklist(resetList);
      await AsyncStorage.setItem(`@checklist_${selectedDate}`, JSON.stringify(resetList));
    } catch (err) {
      console.error('Failed to reset checklist:', err);
      Alert.alert('Error', 'Failed to reset checklist. Please try again.');
    }
  };

  const getMarkedDates = () => {
    const markedDates: any = {};
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.accent.primary
    };
    return markedDates;
  };

  const handleDateSelect = (day: DateData) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    setMarkedDates({
      [dateString]: { selected: true }
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color={colors.accent.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              loadChecklist();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Care Checklist" />

      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            current={selectedDate || undefined}
            markedDates={markedDates || {}}
            onDayPress={handleDateSelect}
            theme={{
              selectedDayBackgroundColor: colors.primary.DEFAULT,
              todayTextColor: colors.primary.DEFAULT,
              arrowColor: colors.primary.DEFAULT,
            }}
          />
        </View>

        {tasks.map((taskGroup) => (
          <View
            key={taskGroup.id}
            style={[styles.taskGroup, { backgroundColor: colors.white }]}
          >
            <View style={styles.taskGroupHeader}>
              <MaterialIcons name={taskGroup.icon} size={24} color={colors.text.primary} />
              <Text style={[styles.taskGroupTitle, { color: colors.text.primary }]}>
                {taskGroup.id}
              </Text>
            </View>
            {taskGroup.tasks.map((task, index) => {
              const item = checklist.find(
                (i) => i.task === task && i.date === selectedDate
              );
              if (!item) return null;
              return (
                <TouchableOpacity
                  key={`${taskGroup.id}-${index}`}
                  style={[styles.taskItem, { borderTopColor: colors.border.light }]}
                  onPress={() => toggleTask(item.id)}
                >
                  <Checkbox
                    status={item.completed ? 'checked' : 'unchecked'}
                    onPress={() => toggleTask(item.id)}
                    color={colors.text.primary}
                  />
                  <Text style={[styles.taskText, { color: colors.text.primary }]}>
                    {task}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  content: {
    flex: 1,
    padding: 16
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  taskGroup: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  taskGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white
  },
  taskGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1
  },
  taskText: {
    fontSize: 16,
    marginLeft: 8
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
});

export default ChecklistScreen;