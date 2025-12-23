'use client';

import Field from '@/components/room/Field/Field';
import FieldOpponent from '@/components/room/FieldOpponent/FieldOpponent';
import { getSocket } from '@/helpers/socket';
import { Flex } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import classes from './Room.module.scss';
import logo from '../../../assets/image/logo.png';
import Image from 'next/image';

interface RoomPageProps {}

interface GameStatus {
  status: 'placing' | 'playing' | 'over';
  isWin: boolean;
  isYourTurn: boolean;
}

const RoomPage: FC<RoomPageProps> = () => {
  const BUILDING_TEXT = 'Build your ships and wait for opponent...';
  const YOUR_TURN = 'Your turn to shoot!';
  const OPPONENT_TURN = 'Opponent shooting...';
  const YOU_WIN_TEXT = 'You win! Nice job, commander!';
  const YOU_LOSE_TEXT = 'Battle is Over! Opponent won.';

  const { roomId } = useParams();
  const [gameStatus, setGameStatus] = useState<GameStatus>({ status: 'placing', isWin: false, isYourTurn: false });

  const playAgain = () => {
    const socket = getSocket();
    socket.emit('refreshGame');
  };

  useEffect(() => {
    const socket = getSocket();
    if (!roomId) return;

    socket.emit('joinRoom', roomId);

    socket.on('initiateFields', ({ field }) => {
      setGameStatus({ status: 'placing', isWin: false, isYourTurn: false });
    });
    socket.on('placingComplete', ({ currentTurnId }) => {
      setGameStatus((prev: any) => ({ ...prev, status: 'playing', isYourTurn: currentTurnId === socket.id }));
    });
    socket.on('isYourTurn', ({ isYourTurn }) => {
      setGameStatus((prev: any) => ({ ...prev, isYourTurn: isYourTurn }));
    });
    socket.on('isYouWin', ({ isYouWin }) => {
      setGameStatus((prev: any) => ({ ...prev, status: 'over', isWin: isYouWin }));
    });

    return () => {
      socket.off('initiateFields');
      socket.off('placingComplete');
      socket.off('isYourTurn');
      socket.off('isYouWin');
    };
  }, [roomId]);

  return (
    <Flex className={classes.room}>
      <Flex className={classes.room__top}>
        <Image src={logo} alt="logo" className={classes.room__top__logo} />
        <h2>
          {gameStatus.status === 'placing'
            ? BUILDING_TEXT
            : gameStatus.status === 'playing'
            ? gameStatus.isYourTurn
              ? YOUR_TURN
              : OPPONENT_TURN
            : gameStatus.isWin
            ? YOU_WIN_TEXT
            : YOU_LOSE_TEXT}
        </h2>
      </Flex>

      <Flex className={classes.room__fields}>
        <Field />
        <FieldOpponent />
      </Flex>
      {gameStatus.status === 'over' && !!gameStatus.isWin && <button onClick={playAgain}>Play again</button>}
    </Flex>
  );
};

export default RoomPage;
