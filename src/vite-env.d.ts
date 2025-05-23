///<reference types="vite/client" />

declare global {
    interface Navigator {
      /** Web Bluetooth API */
      bluetooth: {
        /** Request a BLE device by filters */
        requestDevice(
          options: RequestDeviceOptions
        ): Promise<BluetoothDevice>;
      };
    }
  
    interface RequestDeviceOptions {
      filters?: Array<{
        services?: Array<string>;
        name?: string;
        namePrefix?: string;
      }>;
      optionalServices?: Array<string>;
      acceptAllDevices?: boolean;
    }
  }
  
  // this empty export makes the file a module and applies the above globally
  export {};
  