import BannerAdComponent from '@/components/ads/BannerAdComponent';
import { clearStoredAdErrors, getAdStatus, getStoredAdErrors, logAdInfo } from '@/utils/ads';
import { checkMigrationNeeded, migratePetIdsToUUID } from '@/utils/migratePetIds';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { getColor } from '../theme/colors';

const SettingsScreen: React.FC = (): JSX.Element => {
    const router = useRouter();
    const { logout } = useAuth();
    const insets = useSafeAreaInsets();
    const { isPremium, purchasePremium, restorePurchases, loading } = usePremium();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMigrationNeeded, setIsMigrationNeeded] = useState(false);
    const [adErrors, setAdErrors] = useState<Array<{
        timestamp: string;
        context: string;
        error: string;
    }>>([]);
    const [adStatus, setAdStatus] = useState<{
        platform: string;
        isDev: boolean;
        appOwnership: string;
        interstitialLoaded: boolean;
        hasMobileAds: boolean;
    } | null>(null);

    useEffect(() => {
        checkMigrationStatus();
        loadAdErrors();
        setAdStatus(getAdStatus());
    }, []);

    const checkMigrationStatus = async (): Promise<void> => {
        const needed = await checkMigrationNeeded();
        setIsMigrationNeeded(needed);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await logout();
            router.replace('/');
        } catch {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data cleared successfully');
        } catch {
            Alert.alert('Error', 'Failed to clear data');
        }
    };

    const handleExportData = async (): Promise<void> => {
        try {
            const data = await AsyncStorage.getItem('pets');
            if (data) {
                // TODO: Implement data export functionality
                Alert.alert('Info', 'Export functionality coming soon!');
            }
        } catch {
            Alert.alert('Error', 'Failed to export data. Please try again.');
        }
    };

    const handleImportData = async (): Promise<void> => {
        try {
            // TODO: Implement data import functionality
            Alert.alert('Info', 'Import functionality coming soon!');
        } catch {
            Alert.alert('Error', 'Failed to import data. Please try again.');
        }
    };

    const handleBackupData = async (): Promise<void> => {
        try {
            // TODO: Implement backup functionality
            Alert.alert('Info', 'Backup functionality coming soon!');
        } catch {
            Alert.alert('Error', 'Failed to backup data. Please try again.');
        }
    };

    const handleRestoreData = async (): Promise<void> => {
        try {
            // TODO: Implement restore functionality
            Alert.alert('Info', 'Restore functionality coming soon!');
        } catch {
            Alert.alert('Error', 'Failed to restore data. Please try again.');
        }
    };

    const handleMigration = async (): Promise<void> => {
        try {
            Alert.alert(
                'Migrate Pet IDs',
                'This will convert all pet IDs to UUIDs. This action cannot be undone. Continue?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Migrate',
                        style: 'destructive',
                        onPress: async () => {
                            const result = await migratePetIdsToUUID();
                            Alert.alert(
                                'Migration Complete',
                                `Migrated ${result.migrated} out of ${result.total} pets.`
                            );
                            await checkMigrationStatus();
                        }
                    }
                ]
            );
        } catch {
            Alert.alert('Migration Failed', 'An error occurred during migration.');
        }
    };

    const handlePrintAllPets = async (): Promise<void> => {
        const petsData = await AsyncStorage.getItem('pets');
        if (!petsData) {
            Alert.alert('No pets found in storage.');
            return;
        }
        Alert.alert('Printed all pets to console.');
    };

    const handleClearAllPets = async (): Promise<void> => {
        await AsyncStorage.removeItem('pets');
        Alert.alert('All pets removed from storage.');
        await checkMigrationStatus();
    };

    const loadAdErrors = async (): Promise<void> => {
        try {
            const errors = await getStoredAdErrors();
            setAdErrors(errors);
        } catch {
            setAdErrors([]);
        }
    };

    const handleClearAdErrors = async (): Promise<void> => {
        try {
            await clearStoredAdErrors();
            setAdErrors([]);
        } catch {
            // Ignore errors when clearing
        }
    };

    const handleTestAdLogging = (): void => {
        logAdInfo('Test Info', { message: 'Test info message' });
    };

    const handlePurchasePremium = async (): Promise<void> => {
        if (isPremium) {
            Alert.alert('Premium Active', 'You already have premium access!');
            return;
        }

        Alert.alert(
            'Remove Ads',
            'Purchase premium access for £1.99 to remove all ads from the app?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Purchase',
                    onPress: async () => {
                        try {
                            await purchasePremium();
                            Alert.alert('Success!', 'Premium access activated. Ads have been removed.');
                        } catch {
                            Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleRestorePurchases = async (): Promise<void> => {
        try {
            await restorePurchases();
            Alert.alert('Success', 'Purchases restored successfully');
        } catch {
            Alert.alert('Error', 'Failed to restore purchases');
        }
    };

    const handleTogglePremium = async (): Promise<void> => {
        try {
            if (isPremium) {
                // In development, allow toggling premium status for testing
                await purchasePremium(); // This will toggle in dev mode
                Alert.alert('Dev Mode', 'Premium status toggled for testing');
            } else {
                await purchasePremium();
            }
        } catch {
            console.error('Toggle failed');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={getColor.background()} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Premium Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⭐ Premium</Text>
                    
                    {isPremium ? (
                        <View style={styles.settingItem}>
                            <MaterialIcons name="star" size={24} color={getColor.primary()} />
                            <Text style={styles.settingText}>Premium Active - Ads Removed</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.settingItem}
                                onPress={handlePurchasePremium}
                                disabled={loading}
                            >
                                <MaterialIcons name="star" size={24} color={getColor.primary()} />
                                <Text style={styles.settingText}>Remove Ads - £1.99</Text>
                                {loading && (
                                    <MaterialIcons name="hourglass-empty" size={20} color={getColor.textLight()} />
                                )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.settingItem}
                                onPress={handleRestorePurchases}
                                disabled={loading}
                            >
                                <MaterialIcons name="restore" size={24} color={getColor.info()} />
                                <Text style={styles.settingText}>Restore Purchases</Text>
                                {loading && (
                                    <MaterialIcons name="hourglass-empty" size={20} color={getColor.textLight()} />
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogout}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/settings')}
                    >
                        <Text style={styles.buttonText}>Open Settings</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, styles.dangerButton]}
                    onPress={handleClearData}
                >
                    <Text style={styles.buttonText}>Clear All Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleExportData}
                >
                    <Text style={styles.buttonText}>Export Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleImportData}
                >
                    <Text style={styles.buttonText}>Import Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleBackupData}
                >
                    <Text style={styles.buttonText}>Backup Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRestoreData}
                >
                    <Text style={styles.buttonText}>Restore Data</Text>
                </TouchableOpacity>

                {isMigrationNeeded && (
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleMigration}
                    >
                        <MaterialIcons name="update" size={24} color={getColor.warning()} />
                        <Text style={[styles.settingText, { color: getColor.warning() }]}>
                            Migrate Pet IDs (Required)
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color={getColor.textLight()} />
                    </TouchableOpacity>
                )}

                {/* Developer tools for debugging */}
                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={handlePrintAllPets}
                >
                    <MaterialIcons name="bug-report" size={24} color={getColor.info()} />
                    <Text style={[styles.settingText, { color: getColor.info() }]}>Print All Pets (Dev)</Text>
                    <MaterialIcons name="chevron-right" size={24} color={getColor.textLight()} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={handleClearAllPets}
                >
                    <MaterialIcons name="delete" size={24} color={getColor.error()} />
                    <Text style={[styles.settingText, { color: getColor.error() }]}>Clear All Pets (Dev)</Text>
                    <MaterialIcons name="chevron-right" size={24} color={getColor.textLight()} />
                </TouchableOpacity>

                {/* Premium Testing (Development Only) */}
                {__DEV__ && (
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleTogglePremium}
                    >
                        <MaterialIcons name="star" size={24} color={getColor.primary()} />
                        <Text style={[styles.settingText, { color: getColor.primary() }]}>
                            Toggle Premium Status (Dev) - Currently: {isPremium ? 'Active' : 'Inactive'}
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color={getColor.textLight()} />
                    </TouchableOpacity>
                )}

                {/* Debug Section (only in development) */}
                {__DEV__ && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔧 Debug (Development Only)</Text>
                        
                        {/* Ad Status */}
                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Ad Status</Text>
                            <TouchableOpacity 
                                style={styles.debugButton} 
                                onPress={() => setAdStatus(getAdStatus())}
                            >
                                <Text style={styles.debugButtonText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                        {adStatus && (
                            <View style={styles.debugInfo}>
                                <Text style={styles.debugText}>Platform: {adStatus.platform}</Text>
                                <Text style={styles.debugText}>Dev Mode: {adStatus.isDev ? 'Yes' : 'No'}</Text>
                                <Text style={styles.debugText}>App Ownership: {adStatus.appOwnership}</Text>
                                <Text style={styles.debugText}>Interstitial Loaded: {adStatus.interstitialLoaded ? 'Yes' : 'No'}</Text>
                                <Text style={styles.debugText}>Has MobileAds: {adStatus.hasMobileAds ? 'Yes' : 'No'}</Text>
                            </View>
                        )}

                        {/* Ad Errors */}
                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Ad Errors ({adErrors.length})</Text>
                            <View style={styles.debugButtons}>
                                <TouchableOpacity 
                                    style={styles.debugButton} 
                                    onPress={loadAdErrors}
                                >
                                    <Text style={styles.debugButtonText}>Refresh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.debugButton, styles.clearButton]} 
                                    onPress={handleClearAdErrors}
                                >
                                    <Text style={styles.debugButtonText}>Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.debugButton} 
                                    onPress={handleTestAdLogging}
                                >
                                    <Text style={styles.debugButtonText}>Test Log</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {adErrors.length > 0 && (
                            <View style={styles.debugInfo}>
                                {adErrors.slice(-3).map((error) => (
                                    <View key={`${error.timestamp}-${error.context}`} style={styles.errorItem}>
                                        <Text style={styles.errorText}>
                                            {error.context}: {error.error}
                                        </Text>
                                        <Text style={styles.errorTimestamp}>
                                            {new Date(error.timestamp).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                
                {/* Banner Ad */}
                <BannerAdComponent style={styles.bannerAd} />
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: getColor.primary(),
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: getColor.background(),
        marginLeft: 16,
    },
    backButton: {
        padding: 8,
    },
    content: {
        padding: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: getColor.primary(),
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    dangerButton: {
        backgroundColor: getColor.error(),
    },
    buttonText: {
        color: getColor.background(),
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: getColor.textLight(),
        borderRadius: 8,
        marginBottom: 12,
    },
    settingText: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
    },
    section: {
        marginTop: 24,
        padding: 16,
        backgroundColor: getColor.background(),
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: getColor.primary(),
        marginBottom: 16,
    },
    settingLabel: {
        flex: 1,
        marginRight: 8,
    },
    debugButton: {
        backgroundColor: getColor.primary(),
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    debugButtonText: {
        color: getColor.background(),
        fontSize: 16,
        fontWeight: 'bold',
    },
    debugInfo: {
        marginTop: 8,
        padding: 12,
        backgroundColor: getColor.background(),
        borderRadius: 8,
    },
    debugText: {
        color: getColor.text(),
        marginBottom: 8,
    },
    debugButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearButton: {
        backgroundColor: getColor.error(),
    },
    errorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    errorText: {
        color: getColor.text(),
    },
    errorTimestamp: {
        color: getColor.textLight(),
    },
    bannerAd: {
        marginTop: 24,
        padding: 16,
        backgroundColor: getColor.background(),
        borderRadius: 8,
    },
});

export default SettingsScreen; 