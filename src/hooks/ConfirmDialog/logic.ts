import { confirmDialogAtom } from "./state";
import { useRecoilState } from "recoil";

// eslint-disable-next-line
export function useLogic() {
  const [baseDialog, setBaseDialog] = useRecoilState(confirmDialogAtom);

  const {
    isOpen,
    main,
    useOk,
    useCancel,
    dismissible,
    onOk,
    onCancel,
    onDismiss,
  } = baseDialog;

  function handleOkClick(): void {
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onOk) {
      onOk();
    }
  }
  function handleCancelClick(): void {
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onCancel) {
      onCancel();
    }
  }

  function handleDismissClick(): void {
    if (dismissible === false) {
      return;
    }
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onDismiss) {
      onDismiss();
    }
  }

  return {
    isOpen,
    main,
    useOk,
    useCancel,
    handleOkClick,
    handleCancelClick,
    handleDismissClick,
  };
}
