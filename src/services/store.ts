import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@services/auth';
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
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
