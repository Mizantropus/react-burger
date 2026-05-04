import { createSlice, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  bun: null,
  ingredients: [],
};

export const addIngredientById = (ingredientId) => (dispatch, getState) => {
  const state = getState();
  const ingredient = state.ingredients.ingredients.find(
    (ing) => ing._id === ingredientId
  );

  if (!ingredient) {
    console.error('Ингредиент не найден');
    return;
  }

  if (ingredient.type === 'bun') {
    dispatch(setBun({ ...ingredient, constructorId: uuidv4() }));
  } else {
    dispatch(addIngredient({ ...ingredient, constructorId: uuidv4() }));
  }
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    removeBun: (state) => {
      state.bun = null;
    },
    addIngredient: (state, action) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },
    moveIngredient: (state, action) => {
      const { toIndex, fromIndex } = action.payload;
      const ingredients = [...state.ingredients];
      ingredients.splice(toIndex, 0, ingredients.splice(fromIndex, 1)[0]);
      state.ingredients = ingredients;
    },
  },
});

const selectBurgerConstructor = (state) => state.burgerConstructor;

export const selectBun = createSelector(
  [selectBurgerConstructor],
  (burgerConstructor) => burgerConstructor.bun
);

export const selectIngredients = createSelector(
  [selectBurgerConstructor],
  (burgerConstructor) => burgerConstructor.ingredients
);

export const getTotalPriceSelector = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    if (!bun || !ingredients.length) return 0;
    return bun.price * 2 + ingredients.reduce((acc, { price }) => acc + price, 0);
  }
);

export const selectIngredientsCount = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    const res = {};
    if (bun) {
      res[bun._id] = 2;
    }
    ingredients.forEach((ingredient) => {
      if (!res[ingredient._id]) res[ingredient._id] = 0;
      res[ingredient._id]++;
    });

    return res;
  }
);

export const { setBun, removeBun, addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
