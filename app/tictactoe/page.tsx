'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TicTacToePage() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });

  const calculateWinner = (squares: string[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (squares: string[]): number[] => {
    return squares
      .map((cell, index) => (cell === '' ? index : -1))
      .filter((pos) => pos !== -1);
  };

  const minimax = (squares: string[], depth: number, isMaximizing: boolean): number => {
    const currentWinner = calculateWinner(squares);

    if (currentWinner === 'O') return 10 - depth;
    if (currentWinner === 'X') return depth - 10;
    if (!squares.includes('')) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(squares)) {
        const newSquares = [...squares];
        newSquares[move] = 'O';
        const score = minimax(newSquares, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(squares)) {
        const newSquares = [...squares];
        newSquares[move] = 'X';
        const score = minimax(newSquares, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getAIMove = (squares: string[]): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const move of getAvailableMoves(squares)) {
      const newSquares = [...squares];
      newSquares[move] = 'O';
      const score = minimax(newSquares, 0, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const handleClick = (index: number) => {
    if (gameOver || board[index] !== '') return;

    const newBoard = [...board];
    newBoard[index] = 'X';

    // Check if player won
    let gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setBoard(newBoard);
      setWinner(gameWinner);
      setGameOver(true);
      setScore((prev) => ({ ...prev, player: prev.player + 1 }));
      return;
    }

    // Check for draw
    if (!newBoard.includes('')) {
      setBoard(newBoard);
      setWinner('draw');
      setGameOver(true);
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    // AI move
    const aiMove = getAIMove(newBoard);
    newBoard[aiMove] = 'O';

    // Check if AI won
    gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setBoard(newBoard);
      setWinner(gameWinner);
      setGameOver(true);
      setScore((prev) => ({ ...prev, ai: prev.ai + 1 }));
      return;
    }

    // Check for draw
    if (!newBoard.includes('')) {
      setBoard(newBoard);
      setWinner('draw');
      setGameOver(true);
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setGameOver(false);
    setWinner(null);
  };

  const getStatusMessage = (): string => {
    if (!gameOver) return 'Your turn (X)';
    if (winner === 'X') return '🎉 You won!';
    if (winner === 'O') return '🤖 AI won!';
    return '🤝 It\'s a draw!';
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-8">
        <Link href="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Tic-Tac-Toe</h1>
        <p className="text-center text-gray-600 mb-6">Play against AI</p>

        {/* Score */}
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-gray-600">You</p>
            <p className="text-2xl font-bold text-blue-600">{score.player}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Draws</p>
            <p className="text-2xl font-bold text-gray-600">{score.draws}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">AI</p>
            <p className="text-2xl font-bold text-indigo-600">{score.ai}</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6 text-lg font-semibold text-gray-800">
          {getStatusMessage()}
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-200 p-2 rounded-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="h-20 bg-white rounded-lg text-3xl font-bold hover:bg-gray-100 transition-colors"
              disabled={gameOver || cell !== ''}
            >
              <span className={cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-indigo-600' : ''}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={resetGame}
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            New Game
          </button>
          <button
            onClick={() => setScore({ player: 0, ai: 0, draws: 0 })}
            className="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-gray-800 font-semibold hover:bg-gray-400 transition-colors"
          >
            Reset Score
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          You are X • AI is O
        </p>
      </div>
    </main>
  );
}
