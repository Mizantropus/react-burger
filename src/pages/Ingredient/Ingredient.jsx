import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';

import styles from './Ingredient.module.css';

export const Ingredient = () => {
  const navigate = useNavigate();
  const { ingredientId } = useParams();
  const [ingredient, setIngredient] = useState(null);
  const { loading: isLoadingIngredients } = useSelector((state) => state.ingredients);
  const allIngredients = useSelector((state) => state.ingredients.ingredients) || [];

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        if (isLoadingIngredients) return;
        const found = allIngredients.find((ingr) => ingr._id === ingredientId);
        if (found) {
          setIngredient(found);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to load ingredients', err);
        navigate('/');
      }
    };
    loadIngredients();
  }, [allIngredients, ingredientId, isLoadingIngredients, navigate]);
  return (
    <>
      {isLoadingIngredients ? (
        <Preloader />
      ) : (
        ingredient && (
          <div className={`${styles.ingredientWrap} pt-3 pb-5`}>
            <p className="mb-8 text text_type_main-large">Детали ингредиента</p>
            <div className={`${styles.ingredientInfo__imagewrap} mb-4`}>
              <img
                className={`${styles.ingredientInfo__image} ml-5 mr-5`}
                src={ingredient.image}
                alt={ingredient.name}
              />
            </div>
            <p
              className={`${styles.ingredientInfo__name} mb-8 text text_type_main-medium`}
            >
              {ingredient.name}
            </p>
            <div
              className={`${styles.ingredientInfo__facts} pl-15 pr-15 text text_type_main-default text_color_inactive`}
            >
              <div className={`${styles.fact__block}`}>
                <span>Калории,ккал</span>
                <span>{ingredient.calories}</span>
              </div>
              <div className={styles.fact__block}>
                <span>Белки, г</span>
                <span>{ingredient.proteins}</span>
              </div>
              <div className={styles.fact__block}>
                <span>Жиры, г</span>
                <span>{ingredient.fat}</span>
              </div>
              <div className={styles.fact__block}>
                <span>Углеводы, г</span>
                <span>{ingredient.carbohydrates}</span>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};
