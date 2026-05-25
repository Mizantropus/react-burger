import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';

import ConstructorArea from '@/components/constructor-area/constructor-area';
import SortableWrap from '@components/sortable-wrap/sortable-wrap';
import { getUser } from '@services/auth';
import {
  removeIngredient,
  getTotalPriceSelector,
  addIngredientById,
} from '@services/burgerConstructor';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onCreateOrderClick: () => void;
};

export const BurgerConstructor = ({
  onCreateOrderClick,
}: TBurgerConstructorProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const user = useAppSelector(getUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [{ draggedItem }, dropRef] = useDrop<
    { id: string; type: string; index?: number },
    unknown,
    { draggedItem: { id: string; type: string; index?: number } | null }
  >(() => ({
    accept: 'ingredient',
    drop: (item): void => {
      dispatch(addIngredientById(item.id));
    },
    collect: (
      monitor
    ): { draggedItem: { id: string; type: string; index?: number } | null } => ({
      draggedItem: monitor.getItem(),
    }),
  }));

  const removeIngredientHandler = (constructorId: string): void => {
    dispatch(removeIngredient(constructorId));
  };

  const finalPrice = useAppSelector(getTotalPriceSelector);

  return (
    <section className={`${styles.burger_constructor} pb-10`}>
      <div
        className={styles.ingredients}
        ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      >
        {
          <>
            {bun ? (
              <div className={`${styles.edgeIngredient} pr-4`}>
                <ConstructorElement
                  type="top"
                  isLocked={true}
                  price={bun.price}
                  text={`${bun.name} (верх)`}
                  thumbnail={bun.image}
                />
              </div>
            ) : (
              <ConstructorArea
                type="top"
                droppable={!!(draggedItem && draggedItem.type === 'bun')}
              >
                Пожалуйста, выберите булку
              </ConstructorArea>
            )}
            {ingredients.length ? (
              <div className={styles.middleIngredients}>
                {ingredients.map((el, index) => (
                  <SortableWrap
                    key={el.constructorId}
                    id={el.constructorId as string}
                    index={index}
                  >
                    <div className={styles.middleIngredient}>
                      <DragIcon type="primary" />
                      <ConstructorElement
                        text={el.name}
                        price={el.price}
                        thumbnail={el.image}
                        handleClose={() =>
                          removeIngredientHandler(el.constructorId as string)
                        }
                      />
                    </div>
                  </SortableWrap>
                ))}
              </div>
            ) : (
              <ConstructorArea droppable={!!(draggedItem && draggedItem.type !== 'bun')}>
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
                droppable={!!(draggedItem && draggedItem.type === 'bun')}
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
