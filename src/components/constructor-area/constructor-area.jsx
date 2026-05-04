import styles from './burger-constructor-area.module.css';

const ConstructorArea = ({ type, children, droppable }) => {
  return (
    <div
      className={`${styles.container} ${type === 'top' ? styles.containerTop : ''} ${type === 'bottom' ? styles.containerBottom : ''} ${droppable ? styles.containerDroppable : ''}`}
    >
      <span className={styles.content}>{children}</span>
    </div>
  );
};

export default ConstructorArea;
