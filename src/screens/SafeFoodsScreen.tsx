import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOOD_GUIDE = {
  safe: {
    vegetables: [
      'Bell Peppers (high in Vitamin C)',
      'Carrots (limit due to sugar content)',
      'Cucumber',
      'Romaine Lettuce',
      'Parsley',
      'Cilantro',
      'Celery',
      'Zucchini',
      'Green Beans',
      'Spinach (in moderation)',
    ],
    fruits: [
      'Apple (no seeds)',
      'Strawberries',
      'Blueberries',
      'Melon',
      'Kiwi',
      'Orange (occasional treat)',
      'Pear (ripe)',
    ],
    herbs: [
      'Basil',
      'Dill',
      'Mint',
      'Oregano',
      'Thyme',
    ],
  },
  unsafe: {
    vegetables: [
      'Iceberg Lettuce',
      'Onions',
      'Garlic',
      'Mushrooms',
      'Potato',
      'Raw Beans',
      'Rhubarb',
    ],
    fruits: [
      'Avocado',
      'Apple Seeds',
      'Fruit Pits/Seeds',
      'Citrus Peels',
    ],
    other: [
      'Chocolate',
      'Dairy Products',
      'Nuts',
      'Seeds',
      'Human Food/Snacks',
      'Processed Foods',
      'Bread/Grains',
    ],
  },
  notes: [
    'Always introduce new foods gradually',
    'Wash all produce thoroughly before feeding',
    'Remove uneaten fresh foods after 4 hours',
    'Hay should make up 80% of their diet',
  ],
};

const SafeFoodsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Safe Foods" />
      <ScrollView style={styles.content}>
        {/* Safe Foods Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="check-circle" size={24} color={colors.primary.DEFAULT} />
              <Text style={styles.cardTitle}>Safe Foods</Text>
            </View>
            {Object.entries(FOOD_GUIDE.safe).map(([category, foods]) => (
              <View key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {foods.map((food, index) => (
                  <View key={index} style={styles.foodItem}>
                    <MaterialIcons name="fiber-manual-record" size={8} color={colors.primary.DEFAULT} />
                    <Text style={styles.foodText}>{food}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Unsafe Foods Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={24} color={colors.buttons.red} />
              <Text style={[styles.cardTitle, { color: colors.buttons.red }]}>Unsafe Foods</Text>
            </View>
            {Object.entries(FOOD_GUIDE.unsafe).map(([category, foods]) => (
              <View key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {foods.map((food, index) => (
                  <View key={index} style={styles.foodItem}>
                    <MaterialIcons name="fiber-manual-record" size={8} color={colors.buttons.red} />
                    <Text style={styles.foodText}>{food}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Notes Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="info" size={24} color={colors.primary.DEFAULT} />
              <Text style={styles.cardTitle}>Important Notes</Text>
            </View>
            {FOOD_GUIDE.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <MaterialIcons name="fiber-manual-record" size={8} color={colors.primary.DEFAULT} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: colors.primary.DEFAULT,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    marginTop: 12,
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  foodText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  noteText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
});

export default SafeFoodsScreen; 