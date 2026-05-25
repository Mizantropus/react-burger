import { makeRequest } from './http-request';

import type { TIngredient, TResponseBody } from '@/types';

export const getIngredients = async (): Promise<TResponseBody<TIngredient[]>> => {
  return makeRequest<TIngredient[]>('api/ingredients');
};
