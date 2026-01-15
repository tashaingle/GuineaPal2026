import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { showInterstitialAd } from '@/utils/ads';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Checkbox } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: getColor.text(),
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: getColor.primary(),
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: getColor.background(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendar: {
    borderRadius: 12,
  },
  taskGroup: {
    marginBottom: 24,
  },
  taskGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginLeft: 8,
  },

  taskText: {
    color: getColor.text(),
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: getColor.textSecondary(),
  },
  sessionCard: {
    backgroundColor: getColor.cardBackground(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: getColor.border(),
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  checklistItem: {
    backgroundColor: getColor.cardBackground(),
    borderColor: getColor.border(),
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedItem: {
    opacity: 0.6,
  },
  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const ChecklistScreen = (): JSX.Element => {
  const today = new Date().toISOString().split('T')[0] as string;
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadChecklist();
  }, []);

  useEffect(() => {
    ensureTasksForDate(selectedDate);
  }, [selectedDate, checklist]);

  const loadChecklist = async (): Promise<void> => {
    try {
      const savedChecklist = await AsyncStorage.getItem('checklist');
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      } else {
        // Initialize with today's tasks
        const initialTasks = tasks.flatMap(taskGroup =>
          taskGroup.tasks.map(task => ({
            id: `${taskGroup.id}-${task}-${today}-${Date.now()}`,
            task,
            completed: false,
            timeOfDay: taskGroup.timeOfDay,
            date: today
          }))
        );
        setChecklist(initialTasks);
        await AsyncStorage.setItem('checklist', JSON.stringify(initialTasks));
      }
    } catch {
      setError('Failed to load checklist');
    } finally {
      setIsLoading(false);
    }
  };

  const ensureTasksForDate = async (date: string): Promise<void> => {
    const existingTasksForDate = checklist.filter(item => item.date === date);
    
    if (existingTasksForDate.length === 0) {
      // Create tasks for this date
      const newTasks = tasks.flatMap(taskGroup =>
        taskGroup.tasks.map(task => ({
          id: `${taskGroup.id}-${task}-${date}-${Date.now()}-${Math.random()}`,
          task,
          completed: false,
          timeOfDay: taskGroup.timeOfDay,
          date: date
        }))
      );
      
      const updatedChecklist = [...checklist, ...newTasks];
      setChecklist(updatedChecklist);
      
      try {
        await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));
      } catch {
        setError('Failed to save new tasks');
      }
    }
  };

  const handleDateSelect = (day: DateData): void => {
    setSelectedDate(day.dateString);
  };

  const handleToggleItem = async (id: string): Promise<void> => {
    try {
      const item = checklist.find(i => i.id === id);
      const wasCompleted = item?.completed || false;
      
      const updatedChecklist = checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setChecklist(updatedChecklist);
      await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));
      
      // Check if we just completed an item (was not completed before, now is completed)
      if (item && !wasCompleted) { // Item was just completed (toggled from false to true)
        const completedToday = updatedChecklist.filter(
          i => i.completed && i.date === selectedDate
        ).length;
        
        // Show ad every 3 completed items
        if (completedToday % 3 === 0 && completedToday > 0) {
          try {
            await showInterstitialAd();
          } catch (adError) {
            console.warn('Failed to show interstitial ad:', adError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update checklist:', error);
      setError('Failed to update checklist');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={getColor.accentPrimary()} />
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Care Checklist" />

      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            current={selectedDate}
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: getColor.primary() }
            }}
            theme={{
              selectedDayBackgroundColor: getColor.primary(),
              todayTextColor: getColor.primary(),
              arrowColor: getColor.primary(),
              textSectionTitleColor: getColor.text(),
              selectedDayTextColor: getColor.white(),
              dayTextColor: getColor.text(),
              textDisabledColor: getColor.textSecondary(),
              dotColor: getColor.primary(),
              selectedDotColor: getColor.white(),
            }}
          />
        </View>

        {tasks.map((taskGroup) => (
          <View
            key={taskGroup.id}
            style={[styles.taskGroup, styles.sessionCard]}
          >
            <View style={styles.taskGroupHeader}>
              <MaterialIcons name={taskGroup.icon} size={24} color={getColor.primary()} />
              <Text style={styles.taskGroupTitle}>
                {taskGroup.id}
              </Text>
            </View>
            {taskGroup.tasks.map((task) => {
              const item = checklist.find(
                (i) => i.task === task && i.date === selectedDate && i.timeOfDay === taskGroup.timeOfDay
              );
              if (!item) return null;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.checklistItem,
                    item.completed && styles.completedItem
                  ]}
                  onPress={() => handleToggleItem(item.id)}
                >
                  <View style={styles.checklistItemContent}>
                    <Checkbox
                      status={item.completed ? 'checked' : 'unchecked'}
                      onPress={() => handleToggleItem(item.id)}
                      color={getColor.primary()}
                    />
                    <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                      {task}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChecklistScreen;