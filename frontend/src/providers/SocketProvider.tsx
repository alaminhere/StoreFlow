'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { socket } from '@/helpers/socket/socket';
import { baseApi } from '@/redux/feature/baseApi';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { useGetMeQuery } from '@/redux/feature/user/userSlice';

type SocketProviderProps = {
  children: ReactNode;
};

const socketTagMap = {
  'brand:updated': 'brand',
  'category:updated': 'category',
  'customer:updated': 'customer',
  'member:updated': 'member',
  'payment_purchase:updated': 'payment_purchase',
  'payment_sale:updated': 'payment_sale',
  'permission:updated': 'permission',
  'product:updated': 'product',
  'purchase:updated': 'purchase',
  'sale:updated': 'sale',
  'store:updated': 'store',
  'supplier:updated': 'supplier',
  'inventory:updated': 'inventory',
  'invoice:updated': 'invoice',
  'user:updated': 'user',
  'stockMovement:updated': 'stockMovement',
  'return:updated': 'return',
} as const;


const SocketProvider = ({ children }: SocketProviderProps) => {
  const dispatch = useDispatch();
  const { data: userData } = useGetMeQuery();
  const { data: storeData } = useGetStoreQuery();

  const userId = userData?.data?.id;
  const storeId = storeData?.data?.id;

  useEffect(() => {
    if (!userId) return;

    const joinRoom = () => {
      socket.emit('join-user', userId);
      if (storeId) {
        socket.emit('join-store', storeId);
      }
    };

    socket.on('connect', joinRoom);
    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    // RTK Query invalidation
    const handlers = Object.entries(socketTagMap).map(([event, tag]) => {
      const handler = () => {
        dispatch(baseApi.util.invalidateTags([tag]));
      };

      socket.on(event, handler);
      return { event, handler };
    });

    return () => {
      socket.emit('leave-user', userId);
      if (storeId) {
        socket.emit('leave-store', storeId);
      }
      socket.off('connect', joinRoom);

      handlers.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });

      socket.disconnect();
    };
  }, [dispatch, storeId, userId]);

  return <>{children}</>;
};

export default SocketProvider;
