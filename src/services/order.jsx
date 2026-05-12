import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { ORDERS_URL } from '@utils/constants';
import { checkResponse } from '@utils/http-request';

const initialState = {
  orderCode: '',
  loading: false,
  error: null,
};

export const sendOrder = createAsyncThunk('order/sendOrder', async (_, { getState }) => {
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

  const data = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: ingredientsIds,
    }),
  }).then(checkResponse);
  return String(data.order.number);
});

const ingredientsSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
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

export default ingredientsSlice.reducer;
