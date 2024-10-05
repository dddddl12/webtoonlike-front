import { atom } from "recoil";

export interface ConfirmDialogT {
  main?: JSX.Element;
  useOk?: boolean;
  useCancel?: boolean;
  dismissible?: boolean;
}

interface ConfirmDialogStateT extends ConfirmDialogT {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export const confirmDialogAtom = atom<ConfirmDialogStateT>({
  key: "confirmDialogAtom",
  default: {
    isOpen: false,
    main: undefined,
    useOk: true,
    useCancel: true,
    dismissible: true,
  }
});
