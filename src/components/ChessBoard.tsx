import React, { useState } from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { Square } from './Square';
import { Footer } from './Footer';

interface ChessBoardProps {
  game: Chess;
  onMove: (game: Chess) => void;
}

interface GameNotification {
  text: string;
  color: string;
  show: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove }) => {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [notification, setNotification] = useState<GameNotification>({
    text: '',
    color: 'text-white',
    show: false
  });
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handlePieceSelect = (position: string) => {
    const moves = game.moves({ square: position as ChessSquare, verbose: true });
    setSelectedPiece(position);
    setPossibleMoves(moves.map(move => move.to));
  };

  const handleDrop = (from: string, to: string) => {
    try {
      const move = game.move({
        from: from as ChessSquare,
        to: to as ChessSquare,
        promotion: 'q'
      });

      if (move) {
        onMove(game);
        setPossibleMoves([]);
        setSelectedPiece(null);
        setLastMove({ from, to });

        // Show appropriate notification
        if (game.isCheckmate()) {
          showNotification('Checkmate!', 'text-red-500');
        } else if (game.isDraw()) {
          showNotification('Draw!', 'text-blue-500');
        } else if (game.isCheck()) {
          showNotification('Check!', 'text-yellow-500');
        }
      }
    } catch (error) {
      console.error('Invalid move:', error);
      showNotification('Invalid move!', 'text-red-500');
    }
  };

  const showNotification = (text: string, color: string) => {
    setNotification({ text, color, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 2000);
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
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-white mb-4">Chess Game</h1>
          
          <div className="text-2xl font-semibold tracking-wide animate-fade-in">
            <span className={`${status.color}`}>{status.text}</span>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-blue-500/10 rounded-xl blur-xl"></div>
            <div className="relative">
              <div className="grid grid-cols-8 w-full max-w-[800px] aspect-square border-8 border-gray-700 rounded-lg overflow-hidden shadow-2xl relative bg-white/5 backdrop-blur-sm">
                {Array.from({ length: 8 }, (_, i) =>
                  Array.from({ length: 8 }, (_, j) => renderSquare(i, j))
                )}
              </div>
              
              {notification.show && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`
                    ${notification.color} text-4xl font-bold
                    px-8 py-4 rounded-lg
                    bg-black/80 backdrop-blur-sm
                    transform transition-all duration-300
                    animate-bounce shadow-2xl
                  `}>
                    {notification.text}
                  </div>
                </div>
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
        </div>

        {/* How to Play Section */}
        {showHowToPlay && (
          <div className="w-80 bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-700/50 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Moving Pieces</h3>
                <p>• Click and drag pieces to make moves</p>
                <p>• Valid moves will be highlighted</p>
                <p>• Click a piece to see possible moves</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Special Moves</h3>
                <p>• Castling: Move king two squares towards rook</p>
                <p>• En Passant: Capture passing pawns</p>
                <p>• Pawn Promotion: Pawns become queens</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Game Status</h3>
                <p>• Check: King is under attack</p>
                <p>• Checkmate: Game over, king captured</p>
                <p>• Draw: No legal moves remain</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Tips</h3>
                <p>• Control the center</p>
                <p>• Protect your king</p>
                <p>• Develop your pieces early</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onHowToPlayClick={() => setShowHowToPlay(!showHowToPlay)} />
    </div>
  );
}; 