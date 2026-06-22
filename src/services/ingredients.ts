import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';

import { INGREDIENTS_URL } from '@utils/constants';
import { makeRequest } from '@utils/http-request';

import type { TIngredient } from '@/types';

import type { RootState } from './store';

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
  async (_, { dispatch }) => {
    const data = await makeRequest<{ data: TIngredient[] }>(INGREDIENTS_URL);
    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error('Failed to fetch ingredients: Invalid data structure');
    }
    if (data.success) {
      dispatch(setIngredients(data.data as TIngredient[]));
    }
    return data.data as TIngredient[];
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
  },
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

const { setIngredients } = ingredientsSlice.actions;
export const { getIngredients } = ingredientsSlice.selectors;

export const getIngredientsDict = createSelector(
  [getIngredients],
  (ingredients: TIngredient[]) =>
    ingredients.reduce(
      (acc, ingredient) => {
        acc[ingredient._id] = ingredient;
        return acc;
      },
      {} as Record<TIngredient['_id'], TIngredient>
    )
);

export const getIngredientById = createSelector(
  [getIngredients, (_state: RootState, id: string): string => id],
  (ingredients: TIngredient[], id: string): TIngredient | undefined =>
    ingredients.find((ingredient) => ingredient._id === id)
);
