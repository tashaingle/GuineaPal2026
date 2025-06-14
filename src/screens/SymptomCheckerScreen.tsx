import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SYMPTOMS = [
    {
        category: 'Respiratory Issues',
        description: 'Problems with breathing and respiratory system',
        symptoms: [
            'Sneezing',
            'Coughing',
            'Wheezing',
            'Difficulty breathing',
            'Runny nose'
        ],
        possibleCauses: [
            'Upper respiratory infection',
            'Allergies',
            'Dust or bedding irritation',
            'Poor ventilation',
            'Temperature extremes'
        ],
        severity: 'High',
        recommendedActions: [
            'Keep the environment clean and well-ventilated',
            'Maintain proper temperature (65-75°F)',
            'Use dust-free bedding',
            'Avoid drafts',
            'Seek veterinary care if symptoms persist'
        ]
    },
    {
        category: 'Digestive Problems',
        description: 'Issues with eating, digestion, and waste',
        symptoms: [
            'Loss of appetite',
            'Diarrhea',
            'Constipation',
            'Weight loss',
            'Abnormal droppings'
        ],
        possibleCauses: [
            'Dietary changes',
            'Parasites',
            'Bacterial infection',
            'Dental problems',
            'Stress'
        ],
        severity: 'High',
        recommendedActions: [
            'Ensure constant access to hay',
            'Provide fresh vegetables daily',
            'Keep water clean and fresh',
            'Monitor food intake',
            'Seek veterinary care if symptoms persist'
        ]
    },
    {
        category: 'Skin Issues',
        description: 'Problems with skin and fur condition',
        symptoms: [
            'Hair loss',
            'Scabs or sores',
            'Excessive scratching',
            'Dry or flaky skin',
            'Parasites visible'
        ],
        possibleCauses: [
            'Mites or lice',
            'Fungal infection',
            'Allergies',
            'Poor nutrition',
            'Stress'
        ],
        severity: 'Medium',
        recommendedActions: [
            'Regular grooming',
            'Clean bedding',
            'Proper nutrition',
            'Check for parasites',
            'Consult vet for treatment'
        ]
    },
    {
        category: 'Dental Problems',
        description: 'Issues with teeth and eating',
        symptoms: [
            'Difficulty eating',
            'Drooling',
            'Weight loss',
            'Overgrown teeth',
            'Facial swelling'
        ],
        possibleCauses: [
            'Malocclusion',
            'Poor diet',
            'Lack of hay',
            'Genetic factors',
            'Injury'
        ],
        severity: 'High',
        recommendedActions: [
            'Provide unlimited hay',
            'Regular dental checks',
            'Proper diet',
            'Monitor eating habits',
            'Seek veterinary care'
        ]
    },
    {
        category: 'Urinary Issues',
        description: 'Problems with urination and related systems',
        symptoms: [
            'Difficulty urinating',
            'Blood in urine',
            'Frequent urination',
            'Straining',
            'Crying while urinating'
        ],
        possibleCauses: [
            'Urinary tract infection',
            'Bladder stones',
            'Dehydration',
            'Poor diet',
            'Stress'
        ],
        severity: 'High',
        recommendedActions: [
            'Ensure fresh water',
            'Proper diet',
            'Clean environment',
            'Monitor urination',
            'Seek immediate veterinary care'
        ]
    },
    {
        category: 'Eye Problems',
        description: 'Issues with eyes and vision',
        symptoms: [
            'Cloudy eyes',
            'Discharge',
            'Swelling',
            'Squinting',
            'Redness'
        ],
        possibleCauses: [
            'Infection',
            'Injury',
            'Allergies',
            'Dental problems',
            'Foreign objects'
        ],
        severity: 'Medium',
        recommendedActions: [
            'Keep environment clean',
            'Check for injuries',
            'Monitor behavior',
            'Avoid drafts',
            'Consult vet if symptoms persist'
        ]
    },
    {
        category: 'Behavioral Changes',
        description: 'Unusual changes in behavior and activity',
        symptoms: [
            'Lethargy',
            'Aggression',
            'Hiding',
            'Reduced activity',
            'Changes in social behavior'
        ],
        possibleCauses: [
            'Pain or illness',
            'Stress',
            'Environmental changes',
            'Social issues',
            'Age-related changes'
        ],
        severity: 'Medium',
        recommendedActions: [
            'Monitor behavior',
            'Check environment',
            'Ensure proper socialization',
            'Maintain routine',
            'Consult vet if changes persist'
        ]
    },
    {
        category: 'Weight Changes',
        description: 'Unexpected changes in body weight',
        symptoms: [
            'Sudden weight loss',
            'Weight gain',
            'Loss of muscle mass',
            'Changes in body shape',
            'Reduced appetite'
        ],
        possibleCauses: [
            'Poor diet',
            'Dental problems',
            'Parasites',
            'Underlying illness',
            'Age-related changes'
        ],
        severity: 'High',
        recommendedActions: [
            'Regular weight monitoring',
            'Proper diet',
            'Check teeth',
            'Monitor food intake',
            'Seek veterinary care'
        ]
    }
];

const SymptomCheckerScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <AppHeader title="Symptom Checker" />

            <ScrollView style={styles.content}>
                <Text style={styles.introduction}>
                    Use this guide to help identify potential health issues in your guinea pigs. 
                    Always consult with a veterinarian for proper diagnosis and treatment.
                </Text>

                <View style={styles.gridContainer}>
                    {SYMPTOMS.map((section, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.sectionCard}
                            onPress={() => {
                                router.push({
                                    pathname: '/(stack)/symptom-details',
                                    params: {
                                        category: section.category,
                                        description: section.description,
                                        symptoms: section.symptoms.join(','),
                                        possibleCauses: section.possibleCauses.join(','),
                                        severity: section.severity,
                                        recommendedActions: section.recommendedActions.join(',')
                                    }
                                });
                            }}
                        >
                            <View style={styles.sectionContent}>
                                <MaterialIcons 
                                    name="medical-services" 
                                    size={24} 
                                    color={colors.buttons.brown} 
                                />
                                <Text style={styles.sectionTitle}>{section.category}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    introduction: {
        fontSize: 16,
        color: colors.text.secondary,
        marginBottom: 24,
        lineHeight: 24,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    sectionCard: {
        width: '48%',
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
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
        color: colors.buttons.brown,
        textAlign: 'center',
        marginTop: 12,
    },
});

export default SymptomCheckerScreen; 