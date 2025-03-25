import React from 'react';
import { useDrop } from 'react-dnd';
import { Piece } from './Piece';

interface SquareProps {
  position: string;
  piece: string | null;
  isBlack: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onDrop: (from: string, to: string) => void;
  onPieceSelect: (position: string) => void;
}

interface DragItem {
  type: string;
  position: string;
  piece: string;
}

export const Square: React.FC<SquareProps> = ({ 
  position, 
  piece, 
  isBlack, 
  isHighlighted,
  isSelected,
  isLastMoveFrom,
  isLastMoveTo,
  onDrop,
  onPieceSelect 
}) => {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'piece',
    drop: (item) => {
      if (item.position !== position) {
        onDrop(item.position, position);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: (item) => item.position !== position,
  }), [position, onDrop]);

  const handleClick = () => {
    if (piece) {
      onPieceSelect(position);
    }
  };

  const getSquareColor = () => {
    if (isOver) return 'bg-yellow-400/70';
    if (isLastMoveTo) return isBlack ? 'bg-blue-700' : 'bg-blue-400';
    if (isLastMoveFrom) return isBlack ? 'bg-blue-800' : 'bg-blue-500';
    return isBlack ? 'bg-green-800' : 'bg-green-200';
  };

  return (
    <div
      ref={dropRef}
      onClick={handleClick}
      className={`
        aspect-square w-full flex items-center justify-center 
        ${getSquareColor()}
        ${isHighlighted ? 'after:absolute after:w-1/3 after:h-1/3 after:rounded-full after:bg-gray-100/40 after:animate-pulse' : ''}
        ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
        transition-all duration-200 relative cursor-pointer
        hover:brightness-110
      `}
    >
      {piece && (
        <div className={`transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
          <Piece piece={piece} position={position} />
        </div>
      )}
    </div>
  );
}; 