import AppHeader from '@/components/AppHeader';
import { SYMPTOM_DATA } from '@/data/symptoms';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SymptomCategory {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    category: string;
}

const SymptomCheckerScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const symptomCategories: SymptomCategory[] = [
        {
            title: 'Digestive Issues',
            icon: 'restaurant',
            category: 'digestive'
        },
        {
            title: 'Respiratory Problems',
            icon: 'air',
            category: 'respiratory'
        },
        {
            title: 'Skin & Coat Issues',
            icon: 'pets',
            category: 'skin'
        },
        {
            title: 'Behavioral Changes',
            icon: 'psychology',
            category: 'behavioral'
        },
        {
            title: 'Eye & Ear Problems',
            icon: 'visibility',
            category: 'eye-ear'
        },
        {
            title: 'Urinary Issues',
            icon: 'water-drop',
            category: 'urinary'
        }
    ];

    const handleCategoryPress = (category: SymptomCategory): void => {
        router.push({
            pathname: '/(stack)/symptom-details',
            params: { category: category.category }
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title="Symptom Checker" />

            <View style={styles.content}>
                <Text style={styles.introduction}>
                    Select a category to learn about common guinea pig symptoms and when to seek veterinary care.
                </Text>

                <View style={styles.gridContainer}>
                    {symptomCategories.map((category) => (
                        <TouchableOpacity
                            key={`symptom-${category.title.replace(/\s+/g, '-').toLowerCase()}`}
                            style={styles.sectionCard}
                            onPress={() => handleCategoryPress(category)}
                        >
                            <View style={styles.sectionContent}>
                                <MaterialIcons 
                                    name={category.icon} 
                                    size={48} 
                                    color={getColor.buttonBrown()} 
                                />
                                <Text style={styles.sectionTitle}>{category.title}</Text>
                                <Text style={styles.symptomCount}>
                                    {SYMPTOM_DATA[category.category]?.length || 0} symptoms
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
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
        padding: 12,
    },
    introduction: {
        fontSize: 16,
        color: getColor.textSecondary(),
        marginBottom: 24,
        lineHeight: 24,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    sectionCard: {
        width: '48%',
        backgroundColor: getColor.cardBackground(),
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.buttonBrown(),
        textAlign: 'center',
        marginTop: 12,
    },
    symptomCount: {
        fontSize: 12,
        color: getColor.textSecondary(),
        marginTop: 4,
    },
});

export default SymptomCheckerScreen; 