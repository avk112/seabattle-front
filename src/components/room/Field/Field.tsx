'use client';

import { getSocket } from '@/helpers/socket';
import { Flex } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import classes from './Field.module.scss';

interface FieldProps {}

interface Cell {
  id: number;
  isHit: boolean;
  shipId: number;
}

const Field: FC<FieldProps> = () => {
  const FIELD_SIZE = 10;

  const { roomId } = useParams();
  const [cells, setCells] = useState<Cell[]>([]);

  const cellsBlock = cells?.map((item: Cell, index: number) => {
    const { id, shipId, isHit } = item;
    return (
      <div
        key={index}
        className={`${classes.field__gameArea__cell} ${
          isHit ? (shipId ? classes.hitShip : classes.hitMiss) : shipId ? classes.ship : undefined
        } `}
        onClick={() => buildShip(id)}
      ></div>
    );
  });

  function buildShip(clickedId: number) {
    const socket = getSocket();
    socket.emit('buildShip', { clickedId });
  }

  useEffect(() => {
    const socket = getSocket();
    if (!roomId) return;

    socket.on('joinedRoom', ({ roomId, field }) => {
      setCells(field);
    });

    socket.on('fieldUpdate', ({ field }) => {
      setCells(field);
    });

    socket.on('initiateFields', ({ field }) => {
      setCells(field);
    });

    return () => {
      socket.off('joinedRoom');
      socket.off('fieldUpdate');
      socket.off('initiateFields');
    };
  }, [roomId]);

  return (
    <Flex className={classes.field}>
      <h4>You</h4>

      <Flex className={classes.field__gameArea}>
        {cells.length === Math.pow(FIELD_SIZE, 2) ? cellsBlock : 'Loading...'}
      </Flex>
    </Flex>
  );
};

export default Field;
