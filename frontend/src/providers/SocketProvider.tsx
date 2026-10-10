'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { socket } from '@/helpers/socket/socket';
import { baseApi } from '@/redux/feature/baseApi';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';

type SocketProviderProps = {
  children: ReactNode;
};

const socketTagMap = {
  'brand:updated': 'brand',
  'category:updated': 'category',
  'customer:updated': 'customer',
  'member:updated': 'member',
  'payment_purchase:updated': ['payment_purchase', 'purchase'],
  'payment_sale:updated': ['payment_sale', 'sale'],
  'permission:updated': 'permission',
  'product:updated': ['product', 'productSupplier'],
  'purchase:updated': [
    'purchase',
    'productSupplier',
    'product',
    'stockMovement',
    'inventory',
  ],
  'sale:updated': ['sale', 'product', 'stockMovement', 'inventory'],
  'store:updated': 'store',
  'supplier:updated': ['supplier', 'productSupplier'],
  'inventory:updated': 'inventory',
  'invoice:updated': 'invoice',
  'user:updated': 'user',
  'stockMovement:updated': ['stockMovement', 'product', 'inventory'],
  'return:updated': ['return', 'product', 'stockMovement', 'inventory'],
} as const;

const SocketProvider = ({ children }: SocketProviderProps) => {
  const dispatch = useDispatch();

  const { user, store } = useCurrentUserContext();
  const userId = user?.id;
  const storeId = store?.id;
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      socket.emit('join-user', userId);
      if (storeId) {
        socket.emit('join-store', storeId);
      }
    };

    socket.on('connect', handleConnect);
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    const handlers = Object.entries(socketTagMap).map(([event, tag]) => {
      const handler = () => {
        const tags = Array.isArray(tag) ? [...tag] : [tag];
        dispatch(baseApi.util.invalidateTags(tags));
      };

      socket.on(event, handler);
      return { event, handler };
    });

    return () => {
      socket.emit('leave-user', userId);
      if (storeId) {
        socket.emit('leave-store', storeId);
      }
      socket.off('connect', handleConnect);
      handlers.forEach(({ event, handler }) => socket.off(event, handler));
    };
  }, [dispatch, storeId, userId]);
  return <>{children}</>;
};

export default SocketProvider;
