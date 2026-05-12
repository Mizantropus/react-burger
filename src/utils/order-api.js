import { makeRequest } from './http-request.js';

export const createOrder = async (data) => {
  return makeRequest('api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
