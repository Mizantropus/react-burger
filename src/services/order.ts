import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import { refreshToken } from '@utils/auth-api';
import { ORDERS_URL } from '@utils/constants';
import { makeRequest } from '@utils/http-request';
import * as orderApi from '@utils/order-api';
// import { getCookie } from '@utils/utils';

import type { TOrder, TOrderResponse } from '@/types';

type TOrderState = {
  orderCode: string;
  orderNumber: string;
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

type TOrderThunkApi = {
  state: {
    burgerConstructor: {
      bun: { _id: string } | null;
      ingredients: { _id: string }[];
    };
  };
};

const initialState: TOrderState = {
  orderCode: '',
  orderNumber: '',
  order: null,
  loading: false,
  error: null,
};

export const sendOrder = createAsyncThunk<string, void, TOrderThunkApi>(
  'order/sendOrder',
  async (_, { getState }) => {
    const state = getState();
    const { bun, ingredients } = state.burgerConstructor;
    if (!bun) {
      throw new Error('Unable to create an order without a bun');
    }

    if (ingredients.length === 0) {
      throw new Error('Order creation requires at least one ingredient');
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id,
    ];
    await refreshToken();
    const accessToken = localStorage.getItem('accessToken');
    // const accessToken = getCookie('token');
    const data = await makeRequest<unknown, TOrderResponse>(ORDERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ?? '',
      },
      body: JSON.stringify({
        ingredients: ingredientsIds,
      }),
    });
    return String(data.order.number);
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
      state.orderNumber = String(action.payload.number);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCode = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit order to the server';
      });
  },
});

export const loadOrder = createAsyncThunk(
  'order/getOrder',
  async (id: string, { dispatch }) => {
    const getOrderResult = await orderApi.loadOrder(id);
    if (getOrderResult.success) {
      dispatch(setOrderData(getOrderResult.order));
    }
    return getOrderResult;
  }
);

export default orderSlice.reducer;
export const { setOrderData } = orderSlice.actions;
