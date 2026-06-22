import { createAction } from '@reduxjs/toolkit';

import type { TOrder } from '@/types';

export const wsConnect = createAction<string, 'ordersUser/wsConnect'>(
  'ordersUser/wsConnect'
);
export const wsDisconnect = createAction('ordersUser/wsDisconnect');

export const onOpen = createAction('ordersUser/wsOnOpen');

export const onMessage = createAction(
  'ordersUser/wsOnMessage',
  function prepare(data: { orders: TOrder[]; total: number; totalToday: number }) {
    return {
      payload: {
        ...data,
        orders: data.orders.sort((a, b) => b.number - a.number),
      },
    };
  }
);

export const onError = createAction<string, 'ordersUser/wsOnError'>(
  'ordersUser/wsOnError'
);
export const onClose = createAction('ordersUser/wsOnClose');
