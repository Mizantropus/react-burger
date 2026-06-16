import type { ReactNode, JSX } from 'react';

import styles from './burger-constructor-area.module.css';

type TConstructorAreaProps = {
  type?: 'top' | 'bottom';
  children: ReactNode;
  droppable?: boolean;
};

const ConstructorArea = ({
  type,
  children,
  droppable,
}: TConstructorAreaProps): JSX.Element => {
  return (
    <div
      className={`${styles.container} ${type === 'top' ? styles.containerTop : ''} ${type === 'bottom' ? styles.containerBottom : ''} ${droppable ? styles.containerDroppable : ''}`}
    >
      <span className={styles.content}>{children}</span>
    </div>
  );
};

export default ConstructorArea;
