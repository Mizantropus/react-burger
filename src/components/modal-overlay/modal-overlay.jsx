import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ children, clickHandler, keyDownHandler }) => {
  return (
    <div
      className={styles.modal__overlay}
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
    >
      {children}
    </div>
  );
};
