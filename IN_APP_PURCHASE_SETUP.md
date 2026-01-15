# In-App Purchase Setup Guide

## Overview
GuineaPal includes a premium feature that allows users to remove ads for £1.99. This guide explains how to set up the in-app purchase in the app stores.

## Product Configuration

### Product ID
The app uses the following product ID for the premium purchase:
- **Product ID**: `com.guineapal.app.premium`
- **Price**: £1.99
- **Type**: Non-consumable (one-time purchase)

### App Store Connect (iOS)

1. **Create the Product**:
   - Go to App Store Connect → Your App → Features → In-App Purchases
   - Click the "+" button to create a new in-app purchase
   - Select "Non-Consumable" as the product type
   - Enter the product ID: `com.guineapal.app.premium`

2. **Configure Product Details**:
   - **Reference Name**: "Premium - Remove Ads"
   - **Product ID**: `com.guineapal.app.premium`
   - **Price**: £1.99 (or equivalent in other currencies)
   - **Display Name**: "Remove Ads"
   - **Description**: "Remove all advertisements from GuineaPal for a one-time payment of £1.99"

3. **Review and Submit**:
   - Add a screenshot if required
   - Submit for review along with your app

### Google Play Console (Android)

1. **Create the Product**:
   - Go to Google Play Console → Your App → Monetize → Products → In-app products
   - Click "Create product"
   - Select "Managed product" (non-consumable)

2. **Configure Product Details**:
   - **Product ID**: `com.guineapal.app.premium`
   - **Name**: "Remove Ads"
   - **Description**: "Remove all advertisements from GuineaPal for a one-time payment of £1.99"
   - **Price**: £1.99 (or equivalent in other currencies)

3. **Publish**:
   - Save and activate the product
   - The product will be available when your app is published

## Testing

### Development Testing
In development mode, the app will simulate the purchase by toggling the premium status in AsyncStorage. This allows you to test the UI without making actual purchases.

### Production Testing
1. **iOS**: Use TestFlight with sandbox accounts
2. **Android**: Use internal testing with test accounts
3. **Test Accounts**: Create test accounts in both app stores for testing purchases

## Implementation Details

### Files Modified
- `src/contexts/PremiumContext.tsx` - Premium state management
- `src/services/purchases.ts` - Purchase service functions
- `src/components/PremiumPurchaseButton.tsx` - Purchase button component
- `src/screens/WelcomeScreen.tsx` - Added purchase button and premium indicator
- `src/screens/SettingsScreen.tsx` - Added premium section with purchase and restore options

### Key Features
- **One-time purchase**: Users pay £1.99 once to remove all ads permanently
- **Cross-platform**: Works on both iOS and Android
- **Restore purchases**: Users can restore their purchase if they reinstall the app
- **Development mode**: Simulates purchases for testing
- **Premium indicator**: Shows premium status in the app

### Ad Removal
When premium is active, the following ads are removed:
- Banner ads on all screens
- Interstitial ads (if implemented)
- Any other ad components

## Troubleshooting

### Common Issues
1. **Purchase not working**: Ensure the product ID matches exactly in both the app and app store
2. **Restore not working**: Check that the product is properly configured as non-consumable
3. **Ads still showing**: Verify that the premium status is being properly checked in ad components

### Debug Information
The settings screen includes debug information for ad status (in development mode) to help troubleshoot issues.

## Revenue Tracking
Consider implementing analytics to track:
- Purchase conversion rates
- Revenue from premium purchases
- User retention after premium purchase

## Legal Considerations
- Ensure your app's privacy policy covers in-app purchases
- Follow app store guidelines for in-app purchases
- Consider refund policies and customer support 