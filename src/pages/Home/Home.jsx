import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  setIngredientDetails,
  clearIngredientDetails,
} from '@services/ingredientDetails';
import { sendOrder } from '@services/order';

import styles from './home.module.css';

export const Home = () => {
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const isSendingOrder = useSelector((state) => state.order.loading);

  const dispatch = useDispatch();

  const { ingredients, loading: isLoading } = useSelector((state) => state.ingredients);

  const onCreateOrderClick = async () => {
    await dispatch(sendOrder());
    setIsModalOrderOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const onIngredientClick = (id) => {
    const ingredient = ingredients.find((ing) => ing._id === id);
    dispatch(setIngredientDetails({ ...ingredient, image: ingredient.image_large }));
    navigate(`/ingredient/${id}`, { state: { background: location } });
  };

  const closeIngredientModal = () => {
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
