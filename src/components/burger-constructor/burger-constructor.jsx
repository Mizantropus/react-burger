import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import ConstructorArea from '@/components/constructor-area/constructor-area';
import SortableWrap from '@components/sortable-wrap/sortable-wrap';
import { getUser } from '@services/auth';
import {
  removeIngredient,
  getTotalPriceSelector,
  addIngredientById,
} from '@services/burgerConstructor';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ onCreateOrderClick }) => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [{ draggedItem }, dropRef] = useDrop(() => ({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredientById(item.id));
    },
    collect: (monitor) => ({
      draggedItem: monitor.getItem(),
    }),
  }));

  const removeIngredientHandler = (constructorId) => {
    dispatch(removeIngredient(constructorId));
  };

  const finalPrice = useSelector(getTotalPriceSelector);

  return (
    <section className={`${styles.burger_constructor} pb-10`}>
      <div className={styles.ingredients} ref={dropRef}>
        {
          <>
            {bun ? (
              <div className={`${styles.edgeIngredient} pr-4`}>
                <ConstructorElement
                  type="top"
                  isLocked={true}
                  text={`${bun.name} (верх)`}
                  thumbnail={bun.image}
                />
              </div>
            ) : (
              <ConstructorArea
                type="top"
                droppable={draggedItem && draggedItem.type === 'bun'}
              >
                Пожалуйста, выберите булку
              </ConstructorArea>
            )}
            {ingredients.length ? (
              <div className={styles.middleIngredients}>
                {ingredients.map((el, index) => (
                  <SortableWrap
                    key={el.constructorId}
                    id={el.constructorId}
                    index={index}
                  >
                    <div className={styles.middleIngredient}>
                      <DragIcon type="primary" />
                      <ConstructorElement
                        text={el.name}
                        price={el.price}
                        thumbnail={el.image}
                        handleClose={() => removeIngredientHandler(el.constructorId)}
                      />
                    </div>
                  </SortableWrap>
                ))}
              </div>
            ) : (
              <ConstructorArea droppable={draggedItem && draggedItem.type !== 'bun'}>
                Добавьте ингредиенты
              </ConstructorArea>
            )}
            {bun ? (
              <div className={`${styles.edgeIngredient} pr-4`}>
                <ConstructorElement
                  type="bottom"
                  isLocked={true}
                  text={`${bun.name} (низ)`}
                  price={bun.price}
                  thumbnail={bun.image}
                />
              </div>
            ) : (
              <ConstructorArea
                type="bottom"
                droppable={draggedItem && draggedItem.type === 'bun'}
              >
                Пожалуйста, выберите булку
              </ConstructorArea>
            )}
          </>
        }
      </div>
      <div className={`${styles.bottomWrap} pr-4`}>
        <div className={styles.priceInfo}>
          <span className="text text_type_digits-medium mr-2">{finalPrice}</span>
          <CurrencyIcon className={styles.priceInfo__icon} type="primary" />
        </div>
        <Button
          onClick={() => {
            if (!user) {
              navigate('/login', { state: { from: location.pathname } });
              return;
            }
            onCreateOrderClick();
          }}
          htmlType="button"
          type="primary"
          size="medium"
          extraClass="ml-10"
          disabled={finalPrice === 0}
        >
          Подтвердить заказ
        </Button>
      </div>
    </section>
  );
};
