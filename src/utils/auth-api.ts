import { makeRequest } from './http-request';

import type {
  TAuthTokens,
  TLoginData,
  TRegisterData,
  TResetPasswordData,
  TResponseBody,
  TResponseWithExtras,
  TAuthApiResponse,
  TReqToResetPasswordData,
  TUser,
} from '@/types';

export async function refreshToken(): Promise<
  TResponseWithExtras<unknown, TAuthTokens>
> {
  const refreshData = await makeRequest<unknown, TAuthTokens>('api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  });

  if (refreshData.success) {
    localStorage.setItem('refreshToken', String(refreshData.refreshToken));
    localStorage.setItem('accessToken', String(refreshData.accessToken));
  }

  return refreshData;
}

export async function fetchWithRefresh<
  T = unknown,
  Extra extends Record<string, unknown> = Record<string, unknown>,
>(endpoint: string, options?: RequestInit): Promise<TResponseWithExtras<T, Extra>> {
  try {
    return await makeRequest<T, Extra>(endpoint, options);
  } catch (error) {
    if (error instanceof Error && error.message === 'jwt expired') {
      await refreshToken();
      return makeRequest<T, Extra>(endpoint, options);
    }
    return Promise.reject(error);
  }
}

export async function logIn(loginData: TLoginData): Promise<TAuthApiResponse> {
  const result = await makeRequest<{ user: TUser }, TAuthTokens>('api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (result.success) {
    localStorage.setItem('accessToken', String(result.accessToken));
    localStorage.setItem('refreshToken', String(result.refreshToken));
  }
  return result;
}

export async function logOut(): Promise<TResponseBody<unknown>> {
  const token = localStorage.getItem('refreshToken');
  const result = await makeRequest<unknown>('api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (result.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return result;
}

export async function register(registerData: TRegisterData): Promise<TAuthApiResponse> {
  const result = await makeRequest<{ user: TUser }, TAuthTokens>('api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  if (result.success) {
    localStorage.setItem('accessToken', String(result.accessToken));
    localStorage.setItem('refreshToken', String(result.refreshToken));
  }
  return result;
}

export async function resetPassword(
  resetPassData: TReqToResetPasswordData
): Promise<TResponseBody<unknown>> {
  return makeRequest('api/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetPassData),
  });
}

export async function resetPasswordVerification(
  resetPassData: TResetPasswordData
): Promise<TResponseBody<unknown>> {
  return makeRequest('api/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetPassData),
  });
}

export async function getUserData(): Promise<
  TResponseWithExtras<unknown, { user: TUser }>
> {
  const accessToken = localStorage.getItem('accessToken');

  const fetchWithRefreshResult = await fetchWithRefresh<unknown, { user: TUser }>(
    'api/auth/user',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ?? '',
      },
    }
  );

  if (!fetchWithRefreshResult.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  return fetchWithRefreshResult;
}

export async function updateUserData(
  userData: Partial<TUser>
): Promise<TResponseWithExtras<unknown, { user: TUser }>> {
  const accessToken = localStorage.getItem('accessToken');

  const fetchWithRefreshResult = await fetchWithRefresh<unknown, { user: TUser }>(
    'api/auth/user',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ?? '',
      },
      body: JSON.stringify(userData),
    }
  );

  if (!fetchWithRefreshResult.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return fetchWithRefreshResult;
}
