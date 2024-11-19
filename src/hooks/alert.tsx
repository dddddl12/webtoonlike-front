import { useCallback } from "react";

import { EventEmitter } from "events";

type AlertData = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Create an instance of EventEmitter
const alertEmitter = new EventEmitter();

export const onAlert = (callback: (alertData: AlertData) => void) => {
  alertEmitter.on("show", callback);
};

export const offAlert = (callback: (alertData: AlertData) => void) => {
  alertEmitter.off("show", callback);
};

// Export utility functions to interact with the emitter
const showAlert = (alertData: AlertData) => {
  alertEmitter.emit("show", alertData);
};

export function useAlert(alertData: {
  title: string;
  message: string;
  confirmText: string;
}): () => Promise<boolean> {
  return useCallback(() => {
    return new Promise<boolean>((resolve) => {
      showAlert({
        ...alertData,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, [alertData]);
}
