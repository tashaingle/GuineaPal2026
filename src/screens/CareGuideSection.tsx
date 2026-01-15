import AppHeader from '@/components/AppHeader';
import CageSizeCalculator from '@/components/CageSizeCalculator';
import { CARE_GUIDE_CONTENT } from '@/data/careGuideContent';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CareGuideItem {
    title: string;
    text?: string[];
    component?: string;
    tips?: string[];
    warnings?: string[];
}

interface CareGuideSection {
    title: string;
    content: CareGuideItem[];
}

const CareGuideSection: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { sectionId } = useLocalSearchParams();

    const sectionData = CARE_GUIDE_CONTENT[sectionId as keyof typeof CARE_GUIDE_CONTENT] as CareGuideSection | undefined;

    if (!sectionData) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <AppHeader title="Care Guide" />
                <View style={styles.content}>
                    <Text style={styles.errorText}>Section not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AppHeader title={sectionData.title} />
            
            <ScrollView style={styles.content}>
                {sectionData.content.map((item: CareGuideItem, _index: number) => (
                    <View key={`section-${item.title.replace(/\s+/g, '-').toLowerCase()}`} style={styles.section}>
                        <View style={styles.item}>
                            <MaterialIcons 
                                name="info" 
                                size={24} 
                                color={getColor.buttonBrown()} 
                            />
                            <View style={styles.itemContent}>
                                <Text style={styles.sectionTitle}>{item.title}</Text>
                                {item.text && item.text.map((paragraph: string, _textIndex: number) => (
                                    <Text key={`text-${item.title.replace(/\s+/g, '-').toLowerCase()}-${paragraph.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`} style={styles.itemDescription}>
                                        {paragraph}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* Render component if specified */}
                        {item.component === 'CageSizeCalculator' && (
                            <View style={styles.componentContainer}>
                                <CageSizeCalculator />
                            </View>
                        )}

                        {item.tips && item.tips.length > 0 && (
                            <View style={styles.tipsContainer}>
                                <Text style={styles.tipTitle}>💡 Tips:</Text>
                                {item.tips.map((tip: string, _tipIndex: number) => (
                                    <Text key={`tip-${item.title.replace(/\s+/g, '-').toLowerCase()}-${tip.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`} style={styles.itemDescription}>
                                        • {tip}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {item.warnings && item.warnings.length > 0 && (
                            <View style={styles.warningContainer}>
                                <Text style={styles.warningTitle}>⚠️ Warnings:</Text>
                                {item.warnings.map((warning: string, _warningIndex: number) => (
                                    <Text key={`warning-${item.title.replace(/\s+/g, '-').toLowerCase()}-${warning.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`} style={[styles.itemDescription, { color: getColor.white() }]}>
                                        • {warning}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
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
    content: {
        flex: 1,
        padding: 12,
    },
    section: {
        backgroundColor: getColor.white(),
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: getColor.border(),
    },
    itemContent: {
        flex: 1,
        marginLeft: 12,
    },
    itemDescription: {
        fontSize: 14,
        color: getColor.textSecondary(),
        marginTop: 4,
        lineHeight: 20,
    },
    tipsContainer: {
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 8,
    },
    warningContainer: {
        backgroundColor: getColor.error(),
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.white(),
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: getColor.text(),
        textAlign: 'center',
        marginTop: 20,
    },
    componentContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: getColor.backgroundLight(),
        borderRadius: 8,
    },
});

export default CareGuideSection; 