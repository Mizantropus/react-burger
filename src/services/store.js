import { configureStore } from '@reduxjs/toolkit';

import burgerConstructorReducer from '@services/burgerConstructor';
import ingredientDetailsReducer from '@services/ingredientDetails';
import ingredientsReducer from '@services/ingredients';
import orderReducer from '@services/order';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    order: orderReducer,
    ingredientDetails: ingredientDetailsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
