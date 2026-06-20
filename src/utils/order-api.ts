import { makeRequest } from './http-request';

import type { TOrderResponse, TOrderFullResponse, TResponseWithExtras } from '@/types';

export const createOrder = async (data: {
  ingredients: string[];
}): Promise<TResponseWithExtras<unknown, TOrderResponse>> => {
  return makeRequest<unknown, TOrderResponse>('api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const loadOrder = async (number: number): Promise<TOrderFullResponse> => {
  const accessToken = localStorage.getItem('accessToken') as string;
  return makeRequest<unknown, TOrderFullResponse>(`api/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });
};
