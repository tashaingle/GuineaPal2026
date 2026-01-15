
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { getColor } from '../theme/colors';

const CageSizeCalculator = (): React.JSX.Element => {
    const [numPigs, setNumPigs] = useState('1');
    const [result, setResult] = useState<{
        minSize: string;
        recommendedSize: string;
        dimensions: string[];
    } | null>(null);

    const calculateCageSize = (): void => {
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
                    <Text style={styles.buttonText}>Calculate</Text>
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
                        {result.dimensions.map((dim) => (
                            <Text key={`dimension-${dim.replace(/[^0-9x]/g, '')}`} style={styles.dimensionsText}>
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
        backgroundColor: getColor.background(),
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: getColor.textLight(),
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: getColor.text(),
        marginBottom: 8,
    },
    input: {
        backgroundColor: getColor.background(),
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: getColor.border(),
        fontSize: 16,
    },
    button: {
        marginTop: 8,
    },
    buttonText: {
        color: getColor.text(),
    },
    resultContainer: {
        marginTop: 16,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: getColor.text(),
        marginBottom: 12,
    },
    resultBox: {
        backgroundColor: getColor.background(),
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: getColor.border(),
    },
    resultText: {
        fontSize: 16,
        color: getColor.text(),
        marginBottom: 8,
    },
    dimensionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: getColor.text(),
        marginTop: 12,
        marginBottom: 8,
    },
    dimensionsText: {
        fontSize: 14,
        color: getColor.textLight(),
        marginBottom: 4,
    },
});

export default CageSizeCalculator; 