import AppHeader from '@/components/AppHeader';
import { SYMPTOM_DATA, SymptomData } from '@/data/symptoms';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SymptomDetailsScreen = (): JSX.Element => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [selectedSymptom, setSelectedSymptom] = useState<SymptomData | null>(null);

    const category = params.category as string;
    const symptoms = SYMPTOM_DATA[category] || [];

    const handleSymptomPress = (symptom: SymptomData): void => {
        setSelectedSymptom(symptom);
    };

    const handleBackToList = (): void => {
        setSelectedSymptom(null);
    };

    if (!category || symptoms.length === 0) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.header, styles.errorHeader]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={getColor.buttonBrown()} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Error</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardText}>No symptoms available for this category. Please try again.</Text>
                </View>
            </View>
        );
    }

    if (selectedSymptom) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackToList}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={getColor.buttonBrown()} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{selectedSymptom.title}</Text>
                    </View>
                </View>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Description</Text>
                        <Text style={styles.cardText}>{selectedSymptom.description}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Common Symptoms</Text>
                        {selectedSymptom.symptoms.map((symptomItem) => (
                            <View key={`symptom-${symptomItem}`} style={styles.listItem}>
                                <MaterialIcons name="fiber-manual-record" size={8} color={getColor.primary()} style={styles.bullet} />
                                <Text style={styles.listText}>{symptomItem}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Possible Causes</Text>
                        {selectedSymptom.possibleCauses.map((cause) => (
                            <View key={`cause-${cause}`} style={styles.listItem}>
                                <MaterialIcons name="fiber-manual-record" size={8} color={getColor.primary()} style={styles.bullet} />
                                <Text style={styles.listText}>{cause}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Severity</Text>
                        <View style={[styles.severityBadge, { 
                            backgroundColor: selectedSymptom.severity === 'High' ? getColor.primaryDark() : 
                                           selectedSymptom.severity === 'Medium' ? getColor.buttonOrange() : getColor.buttonGreen()
                        }]}>
                            <Text style={styles.severityText}>{selectedSymptom.severity}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Recommended Actions</Text>
                        {selectedSymptom.recommendedActions.map((action) => (
                            <View key={`action-${action}`} style={styles.listItem}>
                                <MaterialIcons name="fiber-manual-record" size={8} color={getColor.primary()} style={styles.bullet} />
                                <Text style={styles.listText}>{action}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title={symptoms[0]?.category || 'Symptoms'} />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.introduction}>
                    Select a symptom to learn more about it and what actions to take.
                </Text>

                {symptoms.map((symptom) => (
                    <TouchableOpacity
                        key={`symptom-${symptom.title}`}
                        style={styles.symptomCard}
                        onPress={() => handleSymptomPress(symptom)}
                    >
                        <View style={styles.symptomHeader}>
                            <Text style={styles.symptomTitle}>{symptom.title}</Text>
                            <View style={[styles.severityBadge, { 
                                backgroundColor: symptom.severity === 'High' ? getColor.primaryDark() : 
                                               symptom.severity === 'Medium' ? getColor.buttonOrange() : getColor.buttonGreen()
                            }]}>
                                <Text style={styles.severityText}>{symptom.severity}</Text>
                            </View>
                        </View>
                        <Text style={styles.symptomDescription}>{symptom.description}</Text>
                        <View style={styles.symptomFooter}>
                            <MaterialIcons name="chevron-right" size={20} color={getColor.textSecondary()} />
                        </View>
                    </TouchableOpacity>
                ))}
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
        padding: 16,
        marginBottom: 16,
        marginTop: 8,
        backgroundColor: getColor.backgroundLight(),
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: getColor.text(),
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    introduction: {
        fontSize: 16,
        color: getColor.textSecondary(),
        marginBottom: 24,
        lineHeight: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 12,
    },
    cardText: {
        fontSize: 16,
        color: getColor.textLight(),
        lineHeight: 24,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bullet: {
        marginTop: 8,
        marginRight: 8,
    },
    listText: {
        flex: 1,
        fontSize: 16,
        color: getColor.textLight(),
        lineHeight: 24,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    severityText: {
        color: getColor.background(),
        fontSize: 14,
        fontWeight: '600',
    },
    errorHeader: {
        marginTop: 8,
        backgroundColor: getColor.backgroundLight(),
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    symptomCard: {
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
    symptomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    symptomTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: getColor.text(),
        flex: 1,
        marginRight: 12,
    },
    symptomDescription: {
        fontSize: 14,
        color: getColor.textLight(),
        lineHeight: 20,
        marginBottom: 12,
    },
    symptomFooter: {
        alignItems: 'flex-end',
    },
});

export default SymptomDetailsScreen; 