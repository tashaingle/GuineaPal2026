import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../theme/colors';

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
}): React.JSX.Element => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.header,
            { 
                marginTop: Math.max(insets.top - 20, 0),
                backgroundColor: getColor.white()
            }
        ]}>
            <View style={styles.headerRow}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={getColor.buttonBrown()} />
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
                        <MaterialIcons name={rightIcon} size={24} color={getColor.buttonBrown()} />
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
        borderBottomColor: getColor.border(),
        backgroundColor: getColor.white(),
        elevation: 2,
        shadowColor: getColor.shadow(),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
        marginTop: 8,
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
        color: getColor.text(),
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
        color: getColor.buttonBrown(),
        marginRight: 4,
    },
    placeholder: {
        width: 32,
    }
});

export default AppHeader; 