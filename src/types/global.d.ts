export {};

declare global {
  interface Window {
    newrelic: {
      noticeError: (...args: any) => void;
    };
  }
}
