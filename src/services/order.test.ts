import { describe, it, expect } from 'vitest';

import reducer, { setOrderData, sendOrder } from './order';

import type { TOrder } from '@/types';

const mockOrder: TOrder = {
  _id: 'order-1',
  name: 'Test Burger',
  status: 'done',
  number: 123,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: ['ing-1', 'ing-2'],
};

describe('order slice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({
      orderCode: '',
      orderNumber: '',
      order: null,
      loading: false,
      error: null,
    });
  });

  it('setOrderData stores order and sets orderNumber', () => {
    const state = reducer(undefined, setOrderData(mockOrder));
    expect(state.order).toEqual(mockOrder);
    expect(state.orderNumber).toBe('123');
  });

  it('sendOrder.pending sets loading and clears error', () => {
    const state = reducer(undefined, { type: sendOrder.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sendOrder.fulfilled stores orderCode and stops loading', () => {
    const state = reducer(
      { orderCode: '', orderNumber: '', order: null, loading: true, error: null },
      { type: sendOrder.fulfilled.type, payload: '42' }
    );
    expect(state.loading).toBe(false);
    expect(state.orderCode).toBe('42');
  });

  it('sendOrder.rejected stores error and stops loading', () => {
    const state = reducer(
      { orderCode: '', orderNumber: '', order: null, loading: true, error: null },
      { type: sendOrder.rejected.type, error: { message: 'oops' } }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('oops');
  });

  it('sendOrder.rejected falls back to default message when error.message is absent', () => {
    const state = reducer(
      { orderCode: '', orderNumber: '', order: null, loading: true, error: null },
      { type: sendOrder.rejected.type, error: {} }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
