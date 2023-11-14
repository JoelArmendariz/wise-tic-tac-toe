import { createContext } from "react";
import { Modals } from "../../constants/modals";

interface ModalContextState {
  showModal: (modalId: Modals, props?: Record<string, unknown>) => void;
  hideModal: () => void;
}

export const ModalContext = createContext<ModalContextState>({
  showModal: () => undefined,
  hideModal: () => undefined,
});
