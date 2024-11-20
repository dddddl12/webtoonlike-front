import { EventEmitter } from "events";

export type AlertProps = {
  title: string;
  message: string;
};

export type ConfirmProps = {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
};

export type AlertOrConfirmWrapper = {
  type: "alert";
  props: AlertProps;
} | {
  type: "confirm";
  props: ConfirmProps;
};

// Create an instance of EventEmitter
const alertEmitter = new EventEmitter();

export const onAlert = (callback: (wrapper: AlertOrConfirmWrapper) => void) => {
  alertEmitter.on("show", callback);
};

export const offAlert = (callback: (wrapper: AlertOrConfirmWrapper) => void) => {
  alertEmitter.off("show", callback);
};

// Export utility functions to interact with the emitter
export const showAlert = (wrapper: AlertOrConfirmWrapper) => {
  alertEmitter.emit("show", wrapper);
};

export function useConfirm(confirmProps: ConfirmProps) {
  const open = () => {
    showAlert({
      type: "confirm",
      props: confirmProps,
    });
  };
  return { open };
}

export function useAlert(alertProps: AlertProps) {
  const open = () => {
    showAlert({
      type: "alert",
      props: alertProps
    });
  };
  return { open };
}
