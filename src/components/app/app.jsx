import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { API_URL } from '@utils/constants';

import styles from './app.module.css';

export const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalIngredientOpen, setIsModalIngredientOpen] = useState(false);
  const [currentIngredientDetails, setCurrentIngredientDetails] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          return Promise.reject(`Ошибка ${res.status}`);
        }
        const result = await res.json();
        setIngredients(result.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error('error:' + err);
      }
    })();
  }, []);

  const onCreateOrderClick = () => {
    setIsModalOrderOpen(true);
  };

  const onIngredientClick = (id) => {
    const ingredient = ingredients.find((ing) => ing._id === id);
    setIsModalIngredientOpen(true);

    setCurrentIngredientDetails({
      ...ingredient,
      image: ingredient.image_large,
    });
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {!isLoading ? (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={onIngredientClick}
            />
            <BurgerConstructor
              ingredients={ingredients}
              onCreateOrderClick={onCreateOrderClick}
            />
          </main>
          {isModalIngredientOpen && (
            <Modal closeHandler={() => setIsModalIngredientOpen(false)}>
              <IngredientDetails ingredient={currentIngredientDetails} />
            </Modal>
          )}
          {isModalOrderOpen && (
            <Modal closeHandler={() => setIsModalOrderOpen(false)}>
              <OrderDetails />
            </Modal>
          )}
        </>
      ) : (
        <Preloader />
      )}
    </div>
  );
};
