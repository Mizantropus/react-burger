import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { INGREDIENTS_URL } from '@utils/constants';
import { makeRequest } from '@utils/http-request';

import type { TIngredient } from '@/types';

const initialState: {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
} = {
  ingredients: [],
  loading: true,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async () => {
    const data = await makeRequest<{ data: TIngredient[] }>(INGREDIENTS_URL);
    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error('Failed to fetch ingredients: Invalid data structure');
    }
    return data.data as TIngredient[];
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to load ingredients from the server';
      });
  },
});

export default ingredientsSlice.reducer;
