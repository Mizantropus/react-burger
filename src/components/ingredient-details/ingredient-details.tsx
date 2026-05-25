import { useEffect, type JSX } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { setIngredientDetails } from '@services/ingredientDetails';

import type { TIngredient } from '@/types';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { ingredientId } = useParams();

  const ingredient: Partial<TIngredient> =
    useAppSelector((state) => state.ingredientDetails.ingredientDetails) || {};
  const allIngredients = useAppSelector((state) => state.ingredients.ingredients) || [];

  useEffect(() => {
    if (
      (!ingredient || Object.keys(ingredient).length === 0) &&
      ingredientId &&
      allIngredients.length
    ) {
      const found = allIngredients.find((i) => i._id === ingredientId);
      if (found) {
        dispatch(setIngredientDetails({ ...found, image: found.image_large }));
      }
    }
  }, [ingredient, ingredientId, allIngredients, dispatch]);

  return (
    <div className="pt-3 pb-5">
      <p className="mb-8 text text_type_main-large">Детали ингредиента</p>
      <div className={`${styles.ingredientInfo__imagewrap} mb-4`}>
        <img
          className={`${styles.ingredientInfo__image} ml-5 mr-5`}
          src={ingredient.image}
          alt={ingredient.name}
        />
      </div>
      <p className={`${styles.ingredientInfo__name} mb-8 text text_type_main-medium`}>
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
  );
};
