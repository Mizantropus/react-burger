import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { INGREDIENTS_URL } from '@utils/constants';

const initialState = {
  ingredients: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await fetch(INGREDIENTS_URL);
    if (!response.ok) {
      throw new Error('Failed to load ingredients from the server');
    }
    const data = await response.json();
    return data.data;
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
