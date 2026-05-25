import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, type JSX } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useLocation } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  setIngredientDetails,
  clearIngredientDetails,
} from '@services/ingredientDetails';
import { sendOrder } from '@services/order';

import styles from './home.module.css';

export const Home = (): JSX.Element => {
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const isSendingOrder = useAppSelector((state) => state.order.loading);

  const dispatch = useAppDispatch();

  const { ingredients, loading: isLoading } = useAppSelector(
    (state) => state.ingredients
  );

  const onCreateOrderClick = async (): Promise<void> => {
    await dispatch(sendOrder());
    setIsModalOrderOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const onIngredientClick = (id: string): void => {
    const ingredient = ingredients.find((ing) => ing._id === id);
    if (!ingredient) {
      return;
    }
    dispatch(setIngredientDetails({ ...ingredient, image: ingredient.image_large }));
    navigate(`/ingredient/${id}`, { state: { background: location } });
  };

  const closeIngredientModal = (): void => {
    setIsModalOrderOpen(false);
    dispatch(clearIngredientDetails());
  };

  return (
    <div className={styles.app}>
      {isLoading || isSendingOrder ? (
        <Preloader />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients onIngredientClick={onIngredientClick} />
              <BurgerConstructor onCreateOrderClick={onCreateOrderClick} />
            </DndProvider>
          </main>
          {isModalOrderOpen && (
            <Modal closeHandler={closeIngredientModal}>
              <OrderDetails />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};
