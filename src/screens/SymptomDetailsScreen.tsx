import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SymptomDetailsScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    const symptom = {
        category: params.category as string || 'Unknown Category',
        description: params.description as string || 'No description available',
        symptoms: (params.symptoms as string || '').split(',').filter(Boolean),
        possibleCauses: (params.possibleCauses as string || '').split(',').filter(Boolean),
        severity: params.severity as string || 'Unknown',
        recommendedActions: (params.recommendedActions as string || '').split(',').filter(Boolean)
    };

    if (!params.category && !params.description) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.header, { 
                    marginTop: 8,
                    backgroundColor: colors.background.card,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    marginHorizontal: 16,
                    borderRadius: 12,
                }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.brown} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Error</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardText}>No symptom details available. Please try again.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title={symptom.category} />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Description</Text>
                    <Text style={styles.cardText}>{symptom.description}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Common Symptoms</Text>
                    {symptom.symptoms.map((symptom, index) => (
                        <View key={index} style={styles.listItem}>
                            <MaterialIcons name="fiber-manual-record" size={8} color={colors.primary.DEFAULT} style={styles.bullet} />
                            <Text style={styles.listText}>{symptom}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Possible Causes</Text>
                    {symptom.possibleCauses.map((cause, index) => (
                        <View key={index} style={styles.listItem}>
                            <MaterialIcons name="fiber-manual-record" size={8} color={colors.primary.DEFAULT} style={styles.bullet} />
                            <Text style={styles.listText}>{cause}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Severity</Text>
                    <View style={[styles.severityBadge, { 
                        backgroundColor: symptom.severity === 'High' ? colors.primary.dark : colors.primary.light 
                    }]}>
                        <Text style={styles.severityText}>{symptom.severity}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recommended Actions</Text>
                    {symptom.recommendedActions.map((action, index) => (
                        <View key={index} style={styles.listItem}>
                            <MaterialIcons name="fiber-manual-record" size={8} color={colors.primary.DEFAULT} style={styles.bullet} />
                            <Text style={styles.listText}>{action}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
        paddingTop: 0,
    },
    header: {
        padding: 16,
        marginBottom: 16,
        marginTop: 8,
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
        color: colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 16,
        color: colors.text.secondary,
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
        color: colors.text.secondary,
        lineHeight: 24,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    severityText: {
        color: colors.background.DEFAULT,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SymptomDetailsScreen; 