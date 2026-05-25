import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUserData,
  logIn,
  logOut,
  register as registerApi,
  updateUserData as updateUserDataApi,
} from '@utils/auth-api';

import type {
  TLoginData,
  TAuthApiResponse,
  TRegisterData,
  TResponseBody,
  TUpdateUserDataInput,
  TUpdateResult,
} from '@/types';

const initialState = {
  user: null,
  isAuthChecked: false,
};

export const checkIfUserAuthed = createAsyncThunk(
  'auth/checkIfUserAuthed',
  async (_, { dispatch }) => {
    if (!localStorage.getItem('accessToken')) {
      dispatch(setIsAuthChecked(true));
      return;
    }

    try {
      const result = await getUserData();
      if (result.success) {
        dispatch(setUserData(result.user));
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const login = createAsyncThunk<TAuthApiResponse, TLoginData>(
  'auth/login',
  async (loginData, { dispatch, rejectWithValue }) => {
    try {
      const logInResult = await logIn(loginData);
      if (!logInResult.success) {
        throw new Error(logInResult.message || 'Login failed');
      }
      const user = logInResult.data?.user;
      if (!user) {
        throw new Error('User data is missing in response');
      }
      dispatch(setUserData(user));
      return logInResult;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await logOut();
  return response;
});

export const register = createAsyncThunk<TResponseBody, TRegisterData>(
  'auth/register',
  async (registerData, { dispatch }) => {
    const result = await registerApi(registerData);
    if (result.success) {
      const user = result.data?.user;
      if (!user) {
        throw new Error('User data is missing in response');
      }
      dispatch(setUserData(user));
    }
    return result;
  }
);

export const updateUserData = createAsyncThunk<TUpdateResult, TUpdateUserDataInput>(
  'auth/updateUserData',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const result = await updateUserDataApi(userData);
      if (!result.success) {
        throw new Error(result.message || 'Failed to update user data');
      }
      if (!result.user) {
        throw new Error('User data is missing in response');
      }
      dispatch(setUserData(result.user));
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setIsAuthChecked, setUserData } = authSlice.actions;
export const { getUser, getIsAuthChecked } = authSlice.selectors;
export default authSlice.reducer;
