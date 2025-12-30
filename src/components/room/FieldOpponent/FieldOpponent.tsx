'use client';

import { getSocket } from '@/helpers/socket';
import { Badge, Flex } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import classes from './FieldOpponent.module.scss';

interface FieldOpponentProps {}

interface Cell {
  id: number;
  isHit: boolean;
  shipId: number;
}

const FieldOpponent: FC<FieldOpponentProps> = () => {
  const FIELD_SIZE = 10;
  const { roomId } = useParams();

  const [cells, setCells] = useState<Cell[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  const cellsBlock = cells?.map((item: Cell, index: number) => {
    const { id, shipId, isHit } = item;
    return (
      <div
        key={index}
        className={`${classes.fieldOpponent__gameArea__cell} ${
          isHit ? (shipId ? classes.hitShip : classes.hitMiss) : undefined
        } `}
        onClick={() => makeStrike(id)}
      ></div>
    );
  });

  function makeStrike(clickedId: number) {
    const socket = getSocket();
    socket.emit('makeStrike', { clickedId, roomId });
  }

  useEffect(() => {
    const socket = getSocket();
    if (!roomId) return;

    socket.on('joinedRoom', ({ field }) => {
      setCells(field);
    });

    socket.on('opponentFieldUpdate', ({ field }) => {
      setCells(field);
    });

    socket.on('initiateFields', ({ field }) => {
      setCells(field);
    });

    socket.on('opponentJoined', () => {
      setIsOnline(true);
    });

    socket.on('opponentDisconnected', () => {
      setIsOnline(false);
    });

    return () => {
      socket.off('joinedRoom');
      socket.off('opponentFieldUpdate');
      socket.off('initiateFields');
      socket.off('opponentJoined');
    };
  }, [roomId]);

  return (
    <Flex className={classes.fieldOpponent}>
      <Badge.Ribbon text={`${isOnline ? 'Online' : 'Offline'}`} color={`${isOnline ? 'green' : 'grey'}`}>
        {' '}
        <h4>Opponent</h4>
      </Badge.Ribbon>

      <Flex className={classes.fieldOpponent__gameArea}>
        {cells.length === Math.pow(FIELD_SIZE, 2) ? cellsBlock : 'Loading...'}
      </Flex>
    </Flex>
  );
};

export default FieldOpponent;
