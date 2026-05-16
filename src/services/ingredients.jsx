import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { makeRequest } from '@utils/http-request';

const initialState = {
  ingredients: [],
  loading: true,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await makeRequest('api/ingredients');
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
