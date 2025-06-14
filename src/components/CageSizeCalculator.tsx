import colors from '@/theme/colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

const CageSizeCalculator = () => {
    const [numPigs, setNumPigs] = useState('1');
    const [result, setResult] = useState<{
        minSize: string;
        recommendedSize: string;
        dimensions: string[];
    } | null>(null);

    const calculateCageSize = () => {
        const pigs = parseInt(numPigs);
        if (isNaN(pigs) || pigs < 1) {
            setResult(null);
            return;
        }

        // Base size for 1 pig: 7.5 sq ft
        // Additional space per pig: 3.5 sq ft
        const minSize = 7.5 + (pigs - 1) * 3.5;
        const recommendedSize = minSize * 1.2; // 20% larger than minimum

        // Calculate some common dimensions
        const dimensions = [
            `${Math.ceil(Math.sqrt(minSize * 144))}" x ${Math.ceil(Math.sqrt(minSize * 144))}"`,
            `${Math.ceil(Math.sqrt(minSize * 144))}" x ${Math.ceil(minSize * 144 / Math.ceil(Math.sqrt(minSize * 144)))}"`,
            `${Math.ceil(Math.sqrt(recommendedSize * 144))}" x ${Math.ceil(Math.sqrt(recommendedSize * 144))}"`
        ];

        setResult({
            minSize: minSize.toFixed(1),
            recommendedSize: recommendedSize.toFixed(1),
            dimensions
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cage Size Calculator</Text>
            <Text style={styles.description}>
                Calculate the minimum and recommended cage size for your guinea pigs.
            </Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Number of Guinea Pigs:</Text>
                <TextInput
                    style={styles.input}
                    value={numPigs}
                    onChangeText={setNumPigs}
                    keyboardType="number-pad"
                    placeholder="Enter number of pigs"
                />
                <Button
                    mode="contained"
                    onPress={calculateCageSize}
                    style={styles.button}
                >
                    Calculate
                </Button>
            </View>

            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Recommended Cage Sizes:</Text>
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>
                            Minimum Size: {result.minSize} square feet
                        </Text>
                        <Text style={styles.resultText}>
                            Recommended Size: {result.recommendedSize} square feet
                        </Text>
                        <Text style={styles.dimensionsTitle}>Common Dimensions:</Text>
                        {result.dimensions.map((dim, index) => (
                            <Text key={index} style={styles.dimensionsText}>
                                • {dim}
                            </Text>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: colors.text.primary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background.DEFAULT,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
        fontSize: 16,
    },
    button: {
        marginTop: 8,
    },
    resultContainer: {
        marginTop: 16,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    resultBox: {
        backgroundColor: colors.background.DEFAULT,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    resultText: {
        fontSize: 16,
        color: colors.text.primary,
        marginBottom: 8,
    },
    dimensionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: 12,
        marginBottom: 8,
    },
    dimensionsText: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 4,
    },
});

export default CageSizeCalculator; 