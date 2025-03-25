import React from 'react';
import { useDrag } from 'react-dnd';

interface PieceProps {
  piece: string;
  position: string;
}

interface DragItem {
  type: string;
  position: string;
  piece: string;
}

export const Piece: React.FC<PieceProps> = ({ piece, position }) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'piece',
    item: { type: 'piece', position, piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => true,
  }), [position, piece]);

  const getPieceSymbol = (piece: string) => {
    const symbols: { [key: string]: string } = {
      'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
      'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };
    return symbols[piece] || '';
  };

  // Create a ref that combines the drag ref
  const combinedRef = (element: HTMLDivElement | null) => {
    if (drag) {
      (drag as Function)(element);
    }
  };

  return (
    <div
      ref={combinedRef}
      className={`
        text-6xl cursor-move select-none 
        ${isDragging ? 'opacity-30 scale-125' : ''}
        ${piece.startsWith('w') ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow'}
        transition-all duration-200
        hover:scale-110
        active:scale-95
      `}
      style={{ 
        touchAction: 'none',
        transform: `translate(0, 0)`,
        textShadow: piece.startsWith('w') ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
}; 