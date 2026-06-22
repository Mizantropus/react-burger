import { createAction } from '@reduxjs/toolkit';

import type { TOrder } from '@/types';

export const wsConnect = createAction<string, 'ordersAll/wsConnect'>(
  'ordersAll/wsConnect'
);
export const wsDisconnect = createAction('ordersAll/wsDisconnect');

export const onOpen = createAction('ordersAll/wsOnOpen');
export const onMessage = createAction<
  { orders: TOrder[]; total: number; totalToday: number },
  'ordersAll/wsOnMessage'
>('ordersAll/wsOnMessage');
export const onError = createAction<string, 'ordersAll/wsOnError'>(
  'ordersAll/wsOnError'
);
export const onClose = createAction('ordersAll/wsOnClose');
