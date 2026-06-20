import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import { type TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import * as ordersAllSocketActions from './actions/ordersAllSocketActions';
import * as ordersUserSocketActions from './actions/ordersUserSocketActions';

import ingredientsReducer from './ingredients';
import burgerConstructorReducer from './burgerConstructor';
import orderReducer from './order';
import ingredientDetailsReducer from './ingredientDetails';
import authReducer from './auth';
import ordersAll from './ordersAll';
import ordersUser from './ordersUser';
import { socketMiddleware } from './middleware/socket-middleware';

const socketMiddlewareAllOrders = socketMiddleware(
  {
    connect: ordersAllSocketActions.wsConnect,
    disconnect: ordersAllSocketActions.wsDisconnect,
    onOpen: ordersAllSocketActions.onOpen,
    onMessage: ordersAllSocketActions.onMessage,
    onError: ordersAllSocketActions.onError,
    onClose: ordersAllSocketActions.onClose,
  },
  true
) as unknown as Middleware;

const socketMiddlewareUserOrders = socketMiddleware(
  {
    connect: ordersUserSocketActions.wsConnect,
    disconnect: ordersUserSocketActions.wsDisconnect,
    onOpen: ordersUserSocketActions.onOpen,
    onMessage: ordersUserSocketActions.onMessage,
    onError: ordersUserSocketActions.onError,
    onClose: ordersUserSocketActions.onClose,
  },
  true
) as unknown as Middleware;

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  ingredientDetails: ingredientDetailsReducer,
  auth: authReducer,
  ordersAll: ordersAll,
  ordersUser: ordersUser,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddlewareAllOrders, socketMiddlewareUserOrders),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
