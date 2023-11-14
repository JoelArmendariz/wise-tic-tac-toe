import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  FunctionComponent,
  useEffect,
} from "react";
import {
  InjectCommonModalProps,
  ModalDisplay,
  Modals,
} from "../../constants/modals";
import { ModalContext } from "./ModalContext";

interface ModalProviderProps {
  children: JSX.Element;
}

export default function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<{
    id: Modals | null;
    props: Record<string, unknown>;
  }>({
    id: null,
    props: {},
  });

  const showModal = useCallback(
    (modalId: Modals, props?: Record<string, unknown>) => {
      setModal({
        id: modalId,
        props: props || {},
      });
      // Prevent page scrolling when a modal is opened
      document.body.style.overflow = "hidden";
    },
    []
  );

  const hideModal = useCallback(() => {
    setModal({ id: null, props: {} });
    // Allow page scrolling again once the modal closes
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideModal();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [hideModal]);

  const value = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [showModal, hideModal]
  );

  const renderModal = () => {
    if (!modal.id) {
      return null;
    }
    const Modal = ModalDisplay[modal.id] as FunctionComponent<
      InjectCommonModalProps<typeof modal.props>
    >;

    const modalProps = {
      ...modal.props,
      handleClose: hideModal,
    };
    // Creates a dark overlay, handles z indexing, and centers the ModalContent in the screen
    return (
      <>
        <div
          style={{
            width: "100vw",
            height: "100vh",
          }}
          className="absolute flex flex-row z-50 items-center justify-center bg-transparent"
        >
          <Modal {...modalProps} />
        </div>
      </>
    );
  };

  return (
    <ModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </ModalContext.Provider>
  );
}

export const useModalContext = () => useContext(ModalContext);
