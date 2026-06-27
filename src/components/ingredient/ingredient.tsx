import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import type { JSX } from 'react';

import styles from './ingredient.module.css';

type TIngredientProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  count?: number;
  type: string;
  onClickHandler: (id: string) => void;
};

export const Ingredient = ({
  id,
  name,
  price,
  image,
  count: quantity = 0,
  type,
  onClickHandler,
}: TIngredientProps): JSX.Element => {
  const [, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: { id, type },
  }));
  return (
    <article className={styles.ingridient} id={id} onClick={() => onClickHandler(id)}>
      {quantity > 0 && <Counter count={quantity} size="default" extraClass="m-1" />}
      <img
        ref={dragRef as unknown as React.Ref<HTMLImageElement>}
        src={image}
        alt={name}
      />
      <p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
        <span className="mr-2 text text_type_digits-default">{price}</span>
        <CurrencyIcon type="primary" />
      </p>
      <p className="pl-2 pr-2 text text_type_main-default">{name}</p>
    </article>
  );
};
