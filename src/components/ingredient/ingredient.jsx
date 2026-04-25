import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import styles from './ingredient.module.css';

export const Ingredient = ({
  id,
  name,
  price,
  image,
  count: quantity,
  type,
  onClickHandler,
}) => {
  const [, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: { id, type },
  }));
  return (
    <article className={styles.ingridient} onClick={() => onClickHandler(id)}>
      {quantity > 0 && <Counter count={quantity} size="default" extraClass="m-1" />}
      <img ref={dragRef} src={image} alt={name} />
      <p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
        <span className="mr-2 text text_type_digits-default">{price}</span>
        <CurrencyIcon type="primary" />
      </p>
      <p className="pl-2 pr-2 text text_type_main-default">{name}</p>
    </article>
  );
};
