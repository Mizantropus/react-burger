import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  setIngredientDetails,
  clearIngredientDetails,
} from '@services/ingredientDetails';
import { fetchIngredients } from '@services/ingredients';
import { sendOrder } from '@services/order';

import styles from './app.module.css';

export const App = () => {
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalIngredientOpen, setIsModalIngredientOpen] = useState(false);
  const isSendingOrder = useSelector((state) => state.order.loading);

  const dispatch = useDispatch();

  const { ingredients, loading: isLoading } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onCreateOrderClick = async () => {
    await dispatch(sendOrder());
    setIsModalOrderOpen(true);
  };

  const onIngredientClick = (id) => {
    const ingredient = ingredients.find((ing) => ing._id === id);
    dispatch(setIngredientDetails({ ...ingredient, image: ingredient.image_large }));
    setIsModalIngredientOpen(true);
  };

  const closeIngredientModal = () => {
    setIsModalOrderOpen(false);
    dispatch(clearIngredientDetails());
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {isLoading || isSendingOrder ? (
        <Preloader />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients
                ingredients={ingredients}
                onIngredientClick={onIngredientClick}
              />
              <BurgerConstructor onCreateOrderClick={onCreateOrderClick} />
            </DndProvider>
          </main>
          {isModalIngredientOpen && (
            <Modal closeHandler={() => setIsModalIngredientOpen(false)}>
              <IngredientDetails />
            </Modal>
          )}
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
