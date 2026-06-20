import { refreshToken } from '@/utils/auth-api';

import type {
  Middleware,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type WSActions<R, S> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  send?: ActionCreatorWithPayload<S>;
  onConnecting?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <R, S>(
  wsActions: WSActions<R, S>,
  withTokenRefresh = false
): Middleware<Record<string, never>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;

    const {
      connect,
      disconnect,
      onConnecting,
      onOpen,
      onClose,
      onError,
      onMessage,
      send,
    } = wsActions;
    const { dispatch } = store;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let connected = false;
    let url = '';

    return (next) => (action) => {
      if (connect.match(action)) {
        socket = new WebSocket(action.payload);
        if (onConnecting) dispatch(onConnecting());
        connected = true;
        url = action.payload;

        socket.onopen = (): void => {
          console.log('WebSocket onopen');
          if (onOpen) dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('unknown web socket error'));
        };

        socket.onclose = (): void => {
          console.log('WebSocket onclose');
          if (onClose) dispatch(onClose());

          if (connected) {
            reconnectTimer = setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_PERIOD);
          }
        };

        socket.onmessage = (event): void => {
          try {
            const data = JSON.parse(event.data);
            if (withTokenRefresh && data.message === 'Invalid or missing token') {
              refreshToken()
                .then((refreshData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshData.accessToken.replace('Bearer ', '')
                  );
                  dispatch(connect(wssUrl.toString()));
                })
                .catch((e) => {
                  dispatch(onError((e as Error).message));
                });

              dispatch(disconnect());

              return;
            }

            dispatch(onMessage(data));
          } catch (e) {
            dispatch(onError((e as Error).message));
          }
        };

        return;
      }

      if (socket && send?.match(action)) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (e) {
          dispatch(onError((e as Error).message));
        }

        return;
      }

      if (socket && disconnect.match(disconnect)) {
        socket.close();
        connected = false;
        clearTimeout(reconnectTimer);
        socket = null;

        return;
      }

      next(action);
    };
  };
};
