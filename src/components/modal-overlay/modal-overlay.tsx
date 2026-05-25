import type { ReactNode, KeyboardEventHandler, JSX } from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  children: ReactNode;
  clickHandler: () => void;
  keyDownHandler?: KeyboardEventHandler<HTMLDivElement>;
};

export const ModalOverlay = ({
  children,
  clickHandler,
  keyDownHandler,
}: TModalOverlayProps): JSX.Element => {
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
