import AppHeader from '@/components/AppHeader';
import CageSizeCalculator from '@/components/CageSizeCalculator';
import { CARE_GUIDE_CONTENT } from '@/data/careGuideContent';
import colors from '@/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CareGuideSection = {
    title: string;
    content: Array<{
        title: string;
        text: string[];
        component?: string;
        tips?: string[];
        warnings?: string[];
    }>;
};

const CareGuideSection = () => {
    const { sectionId } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const section = CARE_GUIDE_CONTENT[sectionId as keyof typeof CARE_GUIDE_CONTENT] as CareGuideSection | undefined;

    if (!section) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <AppHeader title="Section Not Found" />
                <View style={styles.content}>
                    <Text style={styles.errorText}>This section could not be found.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title={section.title} />
            <ScrollView style={styles.content}>
                {sectionId === 'Cage Size Calculator' ? (
                    <CageSizeCalculator />
                ) : (
                    section.content.map((item, index) => (
                        <View key={index} style={styles.section}>
                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>{item.title}</Text>
                                {item.text && (
                                    <View style={styles.textContainer}>
                                        {item.text.map((paragraph, pIndex) => (
                                            <Text key={pIndex} style={styles.text}>
                                                {paragraph}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                                {item.tips && (
                                    <View style={styles.tipsContainer}>
                                        <Text style={styles.tipsTitle}>Tips:</Text>
                                        {item.tips.map((tip, tIndex) => (
                                            <View key={tIndex} style={styles.bulletPoint}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.bulletText}>{tip}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                {item.warnings && (
                                    <View style={styles.warningsContainer}>
                                        <Text style={styles.warningsTitle}>Warnings:</Text>
                                        {item.warnings.map((warning, wIndex) => (
                                            <View key={wIndex} style={styles.bulletPoint}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.bulletText}>{warning}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
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
    section: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    textContainer: {
        gap: 12,
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: colors.text.primary,
        lineHeight: 24,
    },
    tipsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    warningsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    warningsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    bullet: {
        fontSize: 16,
        color: colors.text.secondary,
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    errorText: {
        fontSize: 16,
        color: colors.text.primary,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CareGuideSection; 