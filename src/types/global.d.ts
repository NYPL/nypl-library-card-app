export {};

declare global {
  interface Window {
    adobeDataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}
