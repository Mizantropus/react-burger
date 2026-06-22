import { makeRequest } from './http-request';

import type {
  TOrderResponse,
  TOrderFullResponse,
  TOrdersFullResponse,
  TResponseWithExtras,
} from '@/types';

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

export const loadOrder = async (id: string): Promise<TOrderFullResponse> => {
  const accessToken = localStorage.getItem('accessToken') as string;
  return makeRequest<unknown, TOrderFullResponse>(`api/orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });
};

export const getOrdersApi = async (): Promise<TOrdersFullResponse> => {
  const accessToken = localStorage.getItem('accessToken') as string;
  return makeRequest<unknown, TOrdersFullResponse>('api/orders/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });
};
