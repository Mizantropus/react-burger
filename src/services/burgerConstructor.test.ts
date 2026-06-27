import { describe, it, expect } from 'vitest';

import reducer, {
  setBun,
  removeBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
} from './burgerConstructor';

import type { TIngredient } from '@/types';

const makeIngredient = (
  id: string,
  constructorId = id,
  price = 10,
  type: TIngredient['type'] = 'main'
): TIngredient => ({
  _id: id,
  constructorId,
  price,
  type,
  name: `Ingredient ${id}`,
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0,
});

describe('burgerConstructor slice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({ ingredients: [], bun: null });
  });

  it('setBun sets the bun', () => {
    const bun = makeIngredient('bun1', 'c1', 50, 'bun');
    const state = reducer(undefined, setBun(bun));
    expect(state.bun).toEqual(bun);
  });

  it('setBun replaces an existing bun', () => {
    const bun1 = makeIngredient('bun1', 'c1', 50, 'bun');
    const bun2 = makeIngredient('bun2', 'c2', 60, 'bun');
    let state = reducer(undefined, setBun(bun1));
    state = reducer(state, setBun(bun2));
    expect(state.bun?._id).toBe('bun2');
  });

  it('removeBun clears the bun', () => {
    const bun = makeIngredient('bun1', 'c1', 50, 'bun');
    let state = reducer(undefined, setBun(bun));
    state = reducer(state, removeBun());
    expect(state.bun).toBeNull();
  });

  it('addIngredient appends an ingredient', () => {
    const a = makeIngredient('a', 'a1');
    const state = reducer(undefined, addIngredient(a));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('a');
  });

  it('removeIngredient removes by constructorId', () => {
    const a = makeIngredient('a', 'a1');
    const b = makeIngredient('b', 'b1');
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));
    state = reducer(state, removeIngredient('a1'));
    expect(state.ingredients.map((i) => i._id)).toEqual(['b']);
  });

  it('moveIngredient reorders ingredients', () => {
    const a = makeIngredient('a', 'a1');
    const b = makeIngredient('b', 'b1');
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));
    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(state.ingredients.map((i) => i._id)).toEqual(['b', 'a']);
  });
});
