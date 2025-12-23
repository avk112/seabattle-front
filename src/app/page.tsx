'use client';

import { Flex, Spin } from 'antd';
import { useEffect, type FC } from 'react';
import { getSocket } from '../helpers/socket';
import { useRouter } from 'next/navigation';
interface AppProps {}

const App: FC<AppProps> = () => {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    const onConnect = () => {
      console.log('Підключено! Socket ID:', socket.id);
      socket.emit('hello', 'Привіт серверу!');
      socket.emit('createRoom');
    };

    const onRoomCreated = ({ roomId }: { roomId: string }) => {
      console.log('Room created:', roomId);
      router.push(`/room/${roomId}`);
    };

    socket.connected ? onConnect() : socket.on('connect', onConnect);

    socket.on('roomCreated', onRoomCreated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('roomCreated', onRoomCreated);
    };
  }, []);

  return (
    <Flex className="homepage">
      <Spin size="large" />
    </Flex>
  );
};

export default App;
