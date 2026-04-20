import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients, onCreateOrderClick }) => {
  const edgeIngreds = ingredients.filter(({ type }) => type === 'bun');
  const middleIngreds = ingredients.filter(({ type }) => type !== 'bun');

  return (
    <section className={`${styles.burger_constructor} pb-10`}>
      <div className={styles.ingredients}>
        <>
          {edgeIngreds.length && (
            <div className={`${styles.edgeIngredient} pr-4`}>
              <ConstructorElement
                isLocked={true}
                type="top"
                price={edgeIngreds[0].price}
                text={`${edgeIngreds[0].name} (верх)`}
                thumbnail={edgeIngreds[0].image}
              />
            </div>
          )}
          <div className={styles.middleIngredients}>
            {middleIngreds.map((ingredient) => (
              <div key={ingredient._id} className={styles.middleIngredient}>
                <DragIcon type="primary" />
                <ConstructorElement
                  text={ingredient.name}
                  price={ingredient.price}
                  thumbnail={ingredient.image}
                />
              </div>
            ))}
          </div>

          {edgeIngreds.length && (
            <div className={`${styles.edgeIngredient} pr-4`}>
              <ConstructorElement
                isLocked={true}
                type="bottom"
                price={edgeIngreds[0].price}
                text={`${edgeIngreds[0].name} (низ)`}
                thumbnail={edgeIngreds[0].image}
              />
            </div>
          )}
        </>
      </div>
      <div className={`${styles.bottomWrap} pr-4`}>
        <div className={styles.priceInfo}>
          <span className="text text_type_digits-medium mr-2">610</span>
          <CurrencyIcon className={styles.priceInfo__icon} type="primary" />
        </div>
        <Button
          onClick={onCreateOrderClick}
          htmlType="button"
          type="primary"
          size="medium"
          extraClass="ml-10"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
