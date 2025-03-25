import React, { useState } from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { Square } from './Square';
import { Footer } from './Footer';

interface ChessBoardProps {
  game: Chess;
  onMove: (game: Chess) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove }) => {
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const handlePieceSelect = (position: string) => {
    const moves = game.moves({ square: position as ChessSquare, verbose: true });
    setSelectedPiece(position);
    setPossibleMoves(moves.map(move => move.to));
    setErrorMessage(null);
  };

  const handleDrop = (from: string, to: string) => {
    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from,
        to,
        promotion: 'q'
      });
      
      if (move) {
        onMove(newGame);
        setPossibleMoves([]);
        setSelectedPiece(null);
        setErrorMessage(null);
        setLastMove({ from, to });
      }
    } catch (error) {
      console.error('Invalid move:', error);
      setErrorMessage('Invalid move! Please try again.');
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  const getGameStatus = () => {
    if (game.isCheckmate()) return { text: 'Checkmate!', color: 'text-red-500' };
    if (game.isDraw()) return { text: 'Draw!', color: 'text-blue-500' };
    if (game.isCheck()) return { text: 'Check!', color: 'text-yellow-500' };
    return { text: `${game.turn() === 'w' ? 'White' : 'Black'} to move`, color: 'text-gray-200' };
  };

  const renderSquare = (i: number, j: number) => {
    const position = `${String.fromCharCode(97 + j)}${8 - i}` as ChessSquare;
    const piece = game.get(position);
    const isBlack = (i + j) % 2 === 1;
    const isHighlighted = possibleMoves.includes(position);
    const isSelected = selectedPiece === position;
    const isLastMoveFrom = lastMove?.from === position;
    const isLastMoveTo = lastMove?.to === position;

    return (
      <Square
        key={position}
        position={position}
        piece={piece ? `${piece.color}${piece.type.toUpperCase()}` : null}
        isBlack={isBlack}
        isHighlighted={isHighlighted}
        isSelected={isSelected}
        isLastMoveFrom={isLastMoveFrom}
        isLastMoveTo={isLastMoveTo}
        onDrop={handleDrop}
        onPieceSelect={handlePieceSelect}
      />
    );
  };

  const status = getGameStatus();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Chess Game</h1>
        
        <div className="text-2xl font-semibold tracking-wide animate-fade-in">
          <span className={`${status.color}`}>{status.text}</span>
        </div>
        
        {errorMessage && (
          <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg animate-bounce backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        <div className="relative">
          <div className="absolute -inset-6 bg-blue-500/10 rounded-xl blur-xl"></div>
          <div className="grid grid-cols-8 w-full max-w-[1000px] aspect-square border-8 border-gray-700 rounded-lg overflow-hidden shadow-2xl relative bg-white/5 backdrop-blur-sm">
            {Array.from({ length: 8 }, (_, i) =>
              Array.from({ length: 8 }, (_, j) => renderSquare(i, j))
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => onMove(new Chess())}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                     font-semibold shadow-lg transition-all duration-200 hover:scale-105
                     focus:ring-4 focus:ring-blue-500/50 outline-none"
          >
            Reset Game
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}; 