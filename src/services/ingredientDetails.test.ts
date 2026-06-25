import { describe, it, expect } from 'vitest';

import reducer, {
  setIngredientDetails,
  clearIngredientDetails,
} from './ingredientDetails';

import type { TIngredient } from '@/types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Space Sauce',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 84,
  price: 88,
  image: 'https://example.com/img.png',
  image_mobile: 'https://example.com/img-mobile.png',
  image_large: 'https://example.com/img-large.png',
  __v: 0,
};

describe('ingredientDetails slice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({ ingredientDetails: null });
  });

  it('setIngredientDetails stores the ingredient', () => {
    const state = reducer(undefined, setIngredientDetails(mockIngredient));
    expect(state.ingredientDetails).toEqual(mockIngredient);
  });

  it('clearIngredientDetails resets to null', () => {
    let state = reducer(undefined, setIngredientDetails(mockIngredient));
    state = reducer(state, clearIngredientDetails());
    expect(state.ingredientDetails).toBeNull();
  });
});
