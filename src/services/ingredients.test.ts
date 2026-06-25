import { describe, it, expect } from 'vitest';

import reducer, { fetchIngredients } from './ingredients';

import type { TIngredient } from '@/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ingredient A',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: '',
    __v: 0,
  },
];

describe('ingredients slice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({ ingredients: [], loading: true, error: null });
  });

  it('fetchIngredients.pending keeps loading and clears error', () => {
    const state = reducer(undefined, { type: fetchIngredients.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled sets ingredients and stops loading', () => {
    const state = reducer(undefined, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    });
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('fetchIngredients.rejected stores error message and stops loading', () => {
    const state = reducer(undefined, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network error' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('fetchIngredients.rejected falls back to default message when error.message is absent', () => {
    const state = reducer(undefined, {
      type: fetchIngredients.rejected.type,
      error: {},
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
