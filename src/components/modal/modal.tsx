import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, type ReactNode, type JSX } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal-root');

type TModalProps = {
  children: ReactNode;
  closeHandler: () => void;
};

export const Modal = ({ children, closeHandler }: TModalProps): JSX.Element | null => {
  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dialogContentRef && dialogContentRef.current) {
      dialogContentRef.current.focus();
    }
  }, []);

  useEffect((): (() => void) => {
    const clickEsc = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'Escape') {
        closeHandler();
      }
    };
    document.addEventListener('keydown', clickEsc, false);
    return (): void => {
      document.removeEventListener('keydown', clickEsc, false);
    };
  }, [closeHandler]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <ModalOverlay clickHandler={closeHandler}>
      <div
        tabIndex={-1}
        ref={dialogContentRef}
        className={`${styles.modal__box} p-10`}
        onClick={(e: React.MouseEvent<HTMLDivElement>): void => e.stopPropagation()}
      >
        <CloseIcon
          type="primary"
          className={styles.modal__closeicon}
          onClick={closeHandler}
        />
        {children}
      </div>
    </ModalOverlay>,
    modalRoot
  );
};
