import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    title: string;
    showBack?: boolean;
    rightIcon?: keyof typeof MaterialIcons.glyphMap;
    rightLabel?: string;
    onRightPress?: () => void;
}

const AppHeader: React.FC<Props> = ({
    title,
    showBack = true,
    rightIcon,
    rightLabel,
    onRightPress,
}) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { marginTop: Math.max(insets.top - 20, 0) }]}>
            <View style={styles.headerRow}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.buttons.brown} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
                {rightIcon && onRightPress ? (
                    <TouchableOpacity
                        onPress={onRightPress}
                        style={styles.rightButton}
                    >
                        {rightLabel && (
                            <Text style={styles.rightLabel}>{rightLabel}</Text>
                        )}
                        <MaterialIcons name={rightIcon} size={24} color={colors.buttons.brown} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        backgroundColor: colors.background.card,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: 16,
        padding: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center',
    },
    rightButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    rightLabel: {
        fontSize: 16,
        color: colors.buttons.brown,
        marginRight: 4,
    },
    placeholder: {
        width: 32,
    }
});

export default AppHeader; 