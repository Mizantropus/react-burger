import { describe, it, expect } from 'vitest';

import authReducer, {
  setUserData,
  setIsAuthChecked,
  login,
  register,
  logout,
} from './auth';

import type { TUser } from '@/types';

const testUser: TUser = { email: 'test@example.com', name: 'Test' };

describe('auth slice', () => {
  it('returns initial state', () => {
    const state = authReducer(undefined, { type: '' });
    expect(state).toEqual({ user: null, isAuthChecked: false });
  });

  it('setUserData sets user', () => {
    const state = authReducer(undefined, setUserData(testUser));
    expect(state.user).toEqual(testUser);
  });

  it('setIsAuthChecked updates flag', () => {
    const state = authReducer(undefined, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('login.fulfilled marks auth as checked', () => {
    const state = authReducer(undefined, { type: login.fulfilled.type });
    expect(state.isAuthChecked).toBe(true);
  });

  it('register.fulfilled marks auth as checked', () => {
    const state = authReducer(undefined, { type: register.fulfilled.type });
    expect(state.isAuthChecked).toBe(true);
  });

  it('logout.fulfilled clears user', () => {
    let state = authReducer(undefined, setUserData(testUser));
    expect(state.user).toEqual(testUser);
    state = authReducer(state, { type: logout.fulfilled.type });
    expect(state.user).toBeNull();
  });
});
