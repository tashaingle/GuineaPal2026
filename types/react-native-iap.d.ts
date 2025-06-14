declare module 'react-native-iap' {
  export interface Product {
    productId: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    localizedPrice: string;
  }

  export interface ProductPurchase {
    productId: string;
    transactionId: string;
    transactionDate: string;
    transactionReceipt: string;
  }

  export interface Purchase {
    productId: string;
    transactionId: string;
    transactionDate: string;
    transactionReceipt: string;
    purchase?: ProductPurchase;
  }

  export interface PurchaseError {
    code: string;
    message: string;
  }

  export interface PurchaseOptions {
    sku: string;
    andDangerouslyFinishTransactionAutomaticallyIOS?: boolean;
  }

  export interface GetProductsOptions {
    skus: string[];
  }

  export function initConnection(): Promise<void>;
  export function endConnection(): Promise<void>;
  export function getProducts(options: GetProductsOptions): Promise<Product[]>;
  export function getSubscriptions(productIds: string[]): Promise<Product[]>;
  export function requestPurchase(options: PurchaseOptions): Promise<ProductPurchase>;
  export function requestSubscription(productId: string): Promise<Purchase>;
  export function finishTransaction(purchase: Purchase): Promise<void>;
  export function clearTransactionIOS(): Promise<void>;
  export function getAvailablePurchases(): Promise<ProductPurchase[]>;
  export function getPendingPurchasesIOS(): Promise<Purchase[]>;
  export function flushFailedPurchasesCachedAsPendingAndroid(): Promise<void>;
} 