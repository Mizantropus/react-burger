import { API_URL } from './constants';

export async function checkResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Unknown error');
  return data;
}

export async function makeRequest(endpoint, options) {
  const response = await fetch(`${API_URL}/${endpoint}`, options);
  return await checkResponse(response);
}
