import { describe, it, expect } from 'vitest';

import { onClose, onError, onMessage, onOpen } from './actions/ordersUserSocketActions';
import reducer from './ordersUser';

import type { TOrder } from '@/types';

const mockOrder: TOrder = {
  _id: 'order-1',
  name: 'Test Burger',
  status: 'done',
  number: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: ['ing-1'],
};

describe('ordersUser slice', () => {
  it('returns initial state shape', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toHaveProperty('orders', []);
    expect(state).toHaveProperty('status');
    expect(state).toHaveProperty('error', null);
    expect(state).toHaveProperty('gotFirstMessage', false);
  });

  it('onOpen sets status to ONLINE', () => {
    const before = reducer(undefined, { type: '' });
    const after = reducer(before, onOpen());
    expect(after.status).not.toBe(before.status);
  });

  it('onMessage sets orders and gotFirstMessage', () => {
    const payload = { orders: [mockOrder], total: 3, totalToday: 1 };
    const state = reducer(undefined, onMessage(payload));
    expect(state.gotFirstMessage).toBe(true);
    expect(state.orders).toEqual([mockOrder]);
  });

  it('onMessage sorts orders by number descending', () => {
    const older: TOrder = { ...mockOrder, _id: 'order-0', number: 1 };
    const newer: TOrder = { ...mockOrder, _id: 'order-2', number: 3 };
    const payload = { orders: [older, newer], total: 2, totalToday: 2 };
    const state = reducer(undefined, onMessage(payload));
    expect(state.orders[0].number).toBeGreaterThan(state.orders[1].number);
  });

  it('onError stores error message', () => {
    const state = reducer(undefined, onError('ws error'));
    expect(state.error).toBe('ws error');
  });

  it('onClose resets status to OFFLINE', () => {
    let state = reducer(undefined, onOpen());
    state = reducer(state, onClose());
    const offlineState = reducer(undefined, { type: '' });
    expect(state.status).toBe(offlineState.status);
  });
});
