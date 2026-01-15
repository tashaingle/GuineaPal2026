import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'bonding-guide'>;

const BONDING_TIPS = [
  {
    title: 'Preparation',
    icon: 'checklist',
    tips: [
      'Clean and prepare a neutral space where neither guinea pig has been before',
      'Have hiding spots and tunnels ready, but avoid enclosed spaces',
      'Place fresh hay and vegetables in multiple locations',
      'Have a spray bottle with water ready in case of fights',
      'Keep a towel nearby for emergency separation if needed',
    ],
  },
  {
    title: 'First Meeting',
    icon: 'people',
    tips: [
      'Start in a large, neutral area',
      'Place both guinea pigs at opposite ends of the space',
      'Watch their body language closely',
      'Allow them to approach each other naturally',
      'Keep the first session short (15-20 minutes)',
    ],
  },
  {
    title: 'Positive Signs',
    icon: 'favorite',
    tips: [
      'Popcorning (jumping for joy)',
      'Sharing food peacefully',
      'Mutual grooming',
      'Sleeping near each other',
      'Calm, relaxed body language',
    ],
  },
  {
    title: 'Warning Signs',
    icon: 'warning',
    tips: [
      'Teeth chattering aggressively',
      'Raised hair/aggressive posturing',
      'Mounting behavior (dominance)',
      'Biting or lunging',
      'Continuous chasing',
    ],
  },
  {
    title: 'Best Practices',
    icon: 'lightbulb',
    tips: [
      'Never leave guinea pigs unsupervised during bonding',
      'Keep sessions regular but not too long',
      'Clean the bonding area between sessions',
      'Be patient - bonding can take days or weeks',
      'Consider age and gender combinations',
    ],
  },
  {
    title: 'Moving In Together',
    icon: 'home',
    tips: [
      'Clean the cage thoroughly before moving in',
      'Provide multiple food and water sources',
      'Have at least 2 hiding spots per pig',
      'Maintain the cage size (min. 10.5 sq ft for 2 pigs)',
      'Keep monitoring their interactions',
    ],
  },
];

const BondingGuideScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.brown} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bonding Guide</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.introduction}>
          Guinea pigs are social animals that usually enjoy companionship, but
          introducing new pets requires patience and careful observation. Follow
          these guidelines for successful bonding:
        </Text>

        {BONDING_TIPS.map((section) => (
          <Card key={`section-${section.title}`} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialIcons
                  name={section.icon as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color={colors.brown}
                />
                <Text style={styles.cardTitle}>{section.title}</Text>
              </View>
              {section.tips.map((tip) => (
                <View key={`tip-${section.title}-${tip}`} style={styles.tipContainer}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}

        <Card style={[styles.card, styles.emergencyCard]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="emergency" size={24} color={getColor.error()} />
              <Text style={[styles.cardTitle, { color: getColor.error() }]}>
                When to Separate
              </Text>
            </View>
            <Text style={styles.emergencyText}>
              Immediately separate guinea pigs if you observe:
            </Text>
            <View style={styles.tipContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>
                Blood drawn from biting
              </Text>
            </View>
            <View style={styles.tipContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>
                Aggressive fighting that doesn't stop
              </Text>
            </View>
            <View style={styles.tipContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>
                One pig constantly bullying the other
              </Text>
            </View>
            <Text style={styles.emergencyText}>
              If this happens, consult a veterinarian or guinea pig expert for
              advice on how to proceed.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
    backgroundColor: getColor.white(),
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.brown,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  introduction: {
    fontSize: 16,
    color: colors.brown,
    lineHeight: 24,
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    backgroundColor: getColor.white(),
    elevation: 2,
    shadowColor: getColor.shadow(),
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.brown,
    marginLeft: 12,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 16,
    color: colors.brown,
    marginRight: 8,
    marginTop: -2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: getColor.secondary(),
    lineHeight: 20,
  },
  emergencyCard: {
    borderWidth: 1,
    borderColor: getColor.error(),
    marginBottom: 32,
  },
  emergencyText: {
    fontSize: 14,
    color: getColor.error(),
    marginBottom: 12,
  },
});

export default BondingGuideScreen; 