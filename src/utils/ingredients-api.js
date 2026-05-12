import { makeRequest } from './http-request.js';

export const getIngredients = async () => {
  return makeRequest('api/ingredients');
};
