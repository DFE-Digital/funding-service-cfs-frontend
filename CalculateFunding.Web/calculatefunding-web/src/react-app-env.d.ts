/// <reference types="react-scripts" />
declare global {
    interface Window {
      clarity?: {
        (...args: any[]): void;
        q?: any[]; 
      };
    }
  }
  export {};