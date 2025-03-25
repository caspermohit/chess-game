import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';

export const Game: React.FC = () => {
  const [game, setGame] = useState(new Chess());

  const handleMove = (newGame: Chess) => {
    setGame(newGame);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ChessBoard game={game} onMove={handleMove} />
    </DndProvider>
  );
}; 