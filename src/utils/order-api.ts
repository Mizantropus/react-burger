import { makeRequest } from './http-request';

import type { TOrderResponse, TResponseWithExtras } from '@/types';

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
