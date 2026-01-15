import AppHeader from '@/components/AppHeader';
import colors, { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CareSection {
    id: string;
    title: string;
    items: {
        title: string;
        content: string[];
    }[];
}

const CARE_SECTIONS: CareSection[] = [
    {
        id: 'Cage Size Calculator',
        title: 'Cage Size Calculator',
        items: [
            {
                title: 'Calculate Your Cage Size',
                content: [
                    'Enter the number of guinea pigs',
                    'Get recommended cage dimensions',
                    'Learn about space requirements',
                    'Tips for cage setup'
                ]
            }
        ]
    },
    {
        id: 'Housing',
        title: 'Housing',
        items: [
            {
                title: 'New Owner Checklist',
                content: [
                    'Essential Supplies',
                    'Initial Setup',
                    'First Week Care',
                    'Veterinary Care'
                ]
            },
            {
                title: 'Daily Care',
                content: [
                    'Fresh water daily',
                    'Clean food dishes',
                    'Refill hay',
                    'Spot clean soiled areas',
                    'Check for signs of illness',
                    'Social interaction and playtime'
                ]
            },
            {
                title: 'Weekly Care',
                content: [
                    'Full cage cleaning',
                    'Nail trimming if needed',
                    'Brush long-haired breeds',
                    'Check teeth length',
                    'Weigh your guinea pig',
                    'Deep clean accessories'
                ]
            }
        ]
    },
    {
        id: 'Diet & Nutrition',
        title: 'Diet & Nutrition',
        items: [
            {
                title: 'Daily Diet Requirements',
                content: [
                    'Unlimited access to fresh timothy hay',
                    '1/8 cup of guinea pig pellets per day',
                    '1 cup of fresh vegetables per day',
                    'Fresh, clean water available at all times',
                    'Vitamin C supplement if needed'
                ]
            },
            {
                title: 'Safe Vegetables',
                content: [
                    'Bell peppers (high in Vitamin C)',
                    'Cucumber',
                    'Carrots (in moderation)',
                    'Romaine lettuce',
                    'Kale (in moderation)',
                    'Parsley',
                    'Cilantro',
                    'Zucchini',
                    'Green beans',
                    'Broccoli (in moderation)'
                ]
            },
            {
                title: 'Safe Fruits (Treats)',
                content: [
                    'Apple (remove seeds)',
                    'Blueberries',
                    'Strawberries',
                    'Watermelon',
                    'Cantaloupe',
                    'Orange (in moderation)',
                    'Pear (remove seeds)',
                    'Raspberries'
                ]
            },
            {
                title: 'Unsafe Foods',
                content: [
                    'Avocado',
                    'Chocolate',
                    'Dairy products',
                    'Meat or fish',
                    'Nuts and seeds',
                    'Onions and garlic',
                    'Potatoes',
                    'Rhubarb',
                    'Tomato leaves and stems',
                    'Iceberg lettuce'
                ]
            },
            {
                title: 'Feeding Tips',
                content: [
                    'Introduce new foods gradually',
                    'Wash all vegetables thoroughly',
                    'Remove uneaten fresh food after 24 hours',
                    'Provide variety in vegetables',
                    'Monitor for any digestive issues',
                    'Adjust portions based on weight and activity'
                ]
            }
        ]
    },
    {
        id: 'Health & Grooming',
        title: 'Health & Grooming',
        items: [
            {
                title: 'Common Health Issues',
                content: [
                    'Respiratory infections',
                    'Dental problems',
                    'Vitamin C deficiency',
                    'Parasites',
                    'Urinary problems',
                    'Skin conditions'
                ]
            },
            {
                title: 'Preventive Care',
                content: [
                    'Regular vet check-ups',
                    'Proper diet and nutrition',
                    'Clean living environment',
                    'Exercise and mental stimulation',
                    'Social interaction',
                    'Stress reduction'
                ]
            },
            {
                title: 'Emergency Signs',
                content: [
                    'Difficulty breathing',
                    'Not eating or drinking',
                    'Weight loss',
                    'Diarrhea or constipation',
                    'Lethargy',
                    'Abnormal behavior'
                ]
            }
        ]
    },
    {
        id: 'Exercise & Play',
        title: 'Exercise & Play',
        items: [
            {
                title: 'Toys & Activities',
                content: [
                    'Tunnels and hidey houses',
                    'Chew toys',
                    'Foraging toys',
                    'Cardboard boxes',
                    'Paper bags',
                    'Hay-based toys'
                ]
            },
            {
                title: 'Playtime Activities',
                content: [
                    'Supervised floor time (30-60 minutes daily)',
                    'Obstacle courses with tunnels and ramps',
                    'Hide and seek with treats',
                    'Ball pit with paper balls',
                    'Digging box with safe bedding',
                    'Foraging games with scattered hay',
                    'Interactive play with safe toys',
                    'Social play with other guinea pigs'
                ]
            },
            {
                title: 'Playtime Safety Tips',
                content: [
                    'Always supervise during playtime',
                    'Ensure the play area is guinea pig-proofed',
                    'Remove any electrical cords or hazards',
                    'Keep other pets away during playtime',
                    'Provide hiding spots for security',
                    'Monitor for signs of stress or fatigue',
                    'Keep play sessions short and positive',
                    'Clean the play area before and after use'
                ]
            },
            {
                title: 'Enrichment Ideas',
                content: [
                    'Rotate toys weekly to maintain interest',
                    'Create different play areas each time',
                    'Use food puzzles and treat balls',
                    'Add new textures and materials',
                    'Create a mini garden with safe plants',
                    'Set up a playpen with various activities',
                    'Use tunnels to connect different areas',
                    'Add safe climbing structures'
                ]
            }
        ]
    },
    {
        id: 'Behavior',
        title: 'Behavior',
        items: [
            {
                title: 'Social Needs',
                content: [
                    'Guinea pigs are social animals',
                    'Best kept in pairs or groups',
                    'Same-sex pairs recommended',
                    'Proper introduction process',
                    'Monitor for compatibility',
                    'Provide enough space for all'
                ]
            },
            {
                title: 'Common Behaviors',
                content: [
                    'Wheeking (excited squeaking)',
                    'Popcorning (happy jumps)',
                    'Rumbling (mating behavior)',
                    'Teeth chattering (warning)',
                    'Purring (contentment)',
                    'Freezing (fear response)'
                ]
            },
            {
                title: 'Handling Tips',
                content: [
                    'Approach slowly and calmly',
                    'Support entire body',
                    'Start with short sessions',
                    'Use treats for positive association',
                    'Respect their boundaries',
                    'Never grab or chase'
                ]
            }
        ]
    },
    {
        id: 'Social Needs',
        title: 'Social Needs',
        items: [
            {
                title: 'Social Needs',
                content: [
                    'Guinea pigs are social animals',
                    'Best kept in pairs or groups',
                    'Same-sex pairs recommended',
                    'Proper introduction process',
                    'Monitor for compatibility',
                    'Provide enough space for all'
                ]
            },
            {
                title: 'Common Behaviors',
                content: [
                    'Wheeking (excited squeaking)',
                    'Popcorning (happy jumps)',
                    'Rumbling (mating behavior)',
                    'Teeth chattering (warning)',
                    'Purring (contentment)',
                    'Freezing (fear response)'
                ]
            },
            {
                title: 'Handling Tips',
                content: [
                    'Approach slowly and calmly',
                    'Support entire body',
                    'Start with short sessions',
                    'Use treats for positive association',
                    'Respect their boundaries',
                    'Never grab or chase'
                ]
            }
        ]
    },
    {
        id: 'Seasonal Care',
        title: 'Seasonal Care',
        items: [
            {
                title: 'Temperature Management',
                content: [
                    'Maintain room temperature between 65-75°F (18-24°C)',
                    'Provide extra bedding in winter',
                    'Ensure good ventilation in summer',
                    'Keep cage away from drafts and direct sunlight'
                ]
            },
            {
                title: 'Seasonal Diet Adjustments',
                content: [
                    'Adjust diet based on seasonal changes',
                    'Provide more fresh vegetables in summer',
                    'Ensure adequate hay supply in winter',
                    'Monitor food freshness and storage'
                ]
            },
            {
                title: 'Outdoor Time',
                content: [
                    'Supervised outdoor time in mild weather',
                    'Use secure playpen or enclosure',
                    'Provide shade and protection',
                    'Check weather conditions before outdoor time'
                ]
            },
            {
                title: 'Holiday Safety',
                content: [
                    'Keep away from holiday decorations',
                    'Maintain regular schedule during holidays',
                    'Ensure proper care during travel',
                    'Secure electrical cords and decorations'
                ]
            }
        ]
    }
];

const GuineaPigLibraryScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title="Care Guide" />

            <ScrollView style={styles.content}>
                <Text style={styles.introduction}>
                    Welcome to the Guinea Pig Care Guide. Tap on any section to learn more about caring for your guinea pigs.
                </Text>

                <View style={styles.gridContainer}>
                    {CARE_SECTIONS.map((section) => (
                        <TouchableOpacity
                            key={section.id}
                            style={styles.sectionCard}
                            onPress={() => {
                                router.push({
                                    pathname: '/(stack)/care-guide-section',
                                    params: { sectionId: section.id }
                                });
                            }}
                        >
                            <View style={styles.sectionContent}>
                                <MaterialIcons 
                                    name="pets" 
                                    size={24} 
                                    color={colors.brown} 
                                />
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
        padding: 16,
    },
    introduction: {
        fontSize: 16,
        color: getColor.text(),
        lineHeight: 24,
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    sectionCard: {
        width: '48%',
        backgroundColor: getColor.white(),
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.brown,
        textAlign: 'center',
        marginTop: 12,
    },
});

export default GuineaPigLibraryScreen; 