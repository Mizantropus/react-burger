import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal-root');

export const Modal = ({ children, closeHandler }) => {
  const dialogContentRef = useRef(null);

  useEffect(() => {
    if (dialogContentRef && dialogContentRef.current) {
      dialogContentRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const clickEsc = (e) => {
      if (e.key === 'Escape') {
        closeHandler();
      }
    };
    document.addEventListener('keydown', clickEsc, false);
    return () => {
      document.removeEventListener('keydown', clickEsc, false);
    };
  }, [closeHandler]);

  return createPortal(
    <ModalOverlay clickHandler={closeHandler}>
      <div
        tabIndex={-1}
        ref={dialogContentRef}
        className={`${styles.modal__box} p-10`}
        onClick={(e) => e.stopPropagation()}
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
