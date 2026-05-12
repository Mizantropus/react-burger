import { makeRequest } from './http-request';

async function refreshToken() {
  const refreshData = await makeRequest('api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  });

  if (refreshData.success) {
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    localStorage.setItem('accessToken', refreshData.accessToken);
  }

  return refreshData;
}

export async function fetchWithRefresh(endpoint, options) {
  try {
    return await makeRequest(endpoint, options);
  } catch (error) {
    if (error.message === 'jwt expired') {
      await refreshToken();
      return makeRequest(endpoint, options);
    }
    return Promise.reject(error);
  }
}

export async function logIn(loginData) {
  const result = await makeRequest('api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (result.success) {
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
  }

  return result;
}

export async function logOut() {
  const token = localStorage.getItem('refreshToken');
  const result = await makeRequest('api/auth/logout', {
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

export async function register(registerData) {
  const result = await makeRequest('api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  if (result.success) {
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
  }

  return result;
}

export async function resetPassword(resetPassData) {
  return makeRequest('api/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetPassData),
  });
}

export async function resetPasswordVerification(resetPassData) {
  return makeRequest('api/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetPassData),
  });
}

export async function getUserData() {
  const accessToken = localStorage.getItem('accessToken');

  const fetchWithRefreshResult = await fetchWithRefresh('api/auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });

  if (!fetchWithRefreshResult.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  return fetchWithRefreshResult;
}

export async function updateUserData(userData) {
  const accessToken = localStorage.getItem('accessToken');

  const fetchWithRefreshResult = await fetchWithRefresh('api/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify(userData),
  });

  if (!fetchWithRefreshResult.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  return fetchWithRefreshResult;
}
