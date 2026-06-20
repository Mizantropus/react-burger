import { createSlice, createSelector } from '@reduxjs/toolkit';

import { OrderStatusCreated, OrderStatusPending, WebSocketStatus } from '@/types';

import { onClose, onError, onMessage, onOpen } from './actions/ordersAllSocketActions';

import type { TOrder } from '@/types';

type IOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: WebSocketStatus;
  error: string | null;
  gotFirstMessage: boolean;
};

const initialState: IOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: WebSocketStatus.OFFLINE,
  error: null,
  gotFirstMessage: false,
};

const ordersAllSlice = createSlice({
  name: 'ordersAll',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
  },
  extraReducers: (builder) => {
    builder.addCase(onOpen, (state) => {
      state.status = WebSocketStatus.ONLINE;
    });
    builder.addCase(onMessage, (state, action) => {
      state.gotFirstMessage = true;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
    builder.addCase(onError, (state, action) => {
      state.error = action.payload;
      state.status = WebSocketStatus.OFFLINE;
    });
    builder.addCase(onClose, (state) => {
      state.status = WebSocketStatus.OFFLINE;
    });
  },
});

export default ordersAllSlice.reducer;
export const { getOrders, getTotal, getTotalToday } = ordersAllSlice.selectors;

export const selectPendingOrders = createSelector([getOrders], (orders: TOrder[]) =>
  orders.filter(({ status }) => status === OrderStatusPending).slice(0, 5)
);

export const selectCreatedOrders = createSelector([getOrders], (orders) =>
  orders.filter((order) => order.status === OrderStatusCreated).slice(0, 5)
);
