import { API_URL } from './constants';

import type { TResponseWithExtras } from '@/types';

export async function checkResponse<
  T = unknown,
  Extra extends Record<string, unknown> = Record<string, unknown>,
>(res: Response): Promise<TResponseWithExtras<T, Extra> & T> {
  const data = (await res.json()) as TResponseWithExtras<T, Extra> & T;
  if (!res.ok) throw new Error(String(data?.message || 'Unknown error'));
  return data;
}

export async function makeRequest<
  T = unknown,
  Extra extends Record<string, unknown> = Record<string, unknown>,
>(endpoint: string, options?: RequestInit): Promise<TResponseWithExtras<T, Extra> & T> {
  const response = await fetch(`${API_URL}/${endpoint}`, options);
  return await checkResponse<T, Extra>(response);
}
