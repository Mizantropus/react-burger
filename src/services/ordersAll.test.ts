import { describe, it, expect } from 'vitest';

import { onClose, onError, onMessage, onOpen } from './actions/ordersAllSocketActions';
import reducer, { fetchOrders } from './ordersAll';

import type { TOrder } from '@/types';

const mockOrder: TOrder = {
  _id: 'order-1',
  name: 'Test Burger',
  status: 'done',
  number: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: ['ing-1'],
};

describe('ordersAll slice', () => {
  it('returns initial state shape', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toHaveProperty('orders', []);
    expect(state).toHaveProperty('total', 0);
    expect(state).toHaveProperty('totalToday', 0);
    expect(state).toHaveProperty('status');
    expect(state).toHaveProperty('error', null);
    expect(state).toHaveProperty('gotFirstMessage', false);
  });

  it('onOpen sets status to ONLINE', () => {
    const before = reducer(undefined, { type: '' });
    const after = reducer(before, onOpen());
    expect(after.status).not.toBe(before.status);
  });

  it('onMessage sets orders, total, totalToday and gotFirstMessage', () => {
    const payload = { orders: [mockOrder], total: 5, totalToday: 2 };
    const state = reducer(undefined, onMessage(payload));
    expect(state.gotFirstMessage).toBe(true);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(5);
    expect(state.totalToday).toBe(2);
  });

  it('onError stores error message', () => {
    const state = reducer(undefined, onError('connection failed'));
    expect(state.error).toBe('connection failed');
  });

  it('onClose resets status to OFFLINE', () => {
    let state = reducer(undefined, onOpen());
    state = reducer(state, onClose());
    const offlineState = reducer(undefined, { type: '' });
    expect(state.status).toBe(offlineState.status);
  });

  it('fetchOrders.fulfilled does not update orders directly (dispatches setOrders internally)', () => {
    const state = reducer(undefined, {
      type: fetchOrders.fulfilled.type,
      payload: [mockOrder],
    });
    expect(state.orders).toEqual([]);
  });
});
