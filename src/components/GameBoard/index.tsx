/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import History from '../History';

export type BoardState = Array<'X' | 'O' | undefined>;

export type HistoryState = Array<{
  data: BoardState;
  location: number | null;
  id: number;
}>;

function checkGameBoard(board: BoardState, ...indices: number[]) {
  const str = indices.map((index) => board[index]).join('');
  return str === 'XXX' || str === 'OOO';
}

const WIN_INDICES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function GameBoard() {
  const [isCurrentPlayerX, setIsCurrentPlayerX] = useState(false);
  const [winIndices, setWinIndices] = useState<Array<number>>();

  const [isWin, setIsWin] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const [history, setHistory] = useState<HistoryState>(() => [
    { id: Date.now(), data: Array(9).fill(undefined), location: null },
  ]);

  const [selectedHistory, setSelectedHistory] = useState<HistoryState[number]>(
    history[0]
  );

  const tick = useCallback(
    (index: number) => () => {
      if (isViewingHistory) return;
      if (selectedHistory.data[index] !== undefined) return;
      if (isWin) return;

      setHistory((h) => {
        const clonedData = [...selectedHistory.data];
        clonedData.splice(index, 1, isCurrentPlayerX ? 'X' : 'O');

        return [...h, { id: Date.now(), location: index, data: clonedData }];
      });

      setIsCurrentPlayerX((bool) => !bool);
    },
    [isCurrentPlayerX, isWin, selectedHistory]
  );

  const reset = useCallback(() => {
    setIsWin(false);
    setIsDraw(false);
    setIsViewingHistory(false);
    setWinIndices([]);
    setHistory([
      { id: Date.now(), data: Array(9).fill(undefined), location: null },
    ]);
  }, []);

  useEffect(() => {
    setSelectedHistory(history[history.length - 1]);
  }, [history]);

  useEffect(() => {
    const win = WIN_INDICES.find((item) =>
      checkGameBoard(selectedHistory.data, ...item)
    );

    if (win) {
      setIsWin(true);
      setWinIndices(win);
      return;
    }

    if (selectedHistory.data.every((item) => item !== undefined)) {
      setIsDraw(true);
    }
  }, [selectedHistory]);

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="font-medium text-2xl">Tic Tac Toe</div>

      {isDraw && (
        <div>
          Game ended with the result of <i>draw</i>
        </div>
      )}
      {isWin && <div>{isCurrentPlayerX ? 'O' : 'X'} won!</div>}
      {!isWin && !isDraw && (
        <div>Next Player: {isCurrentPlayerX ? 'X' : 'O'}</div>
      )}

      <div className="flex gap-4 mt-3">
        <div className="grid grid-cols-3 w-96 shadow-md">
          {Array(9)
            .fill('')
            .map((_, index) => (
              <div
                className={`${
                  !isViewingHistory && winIndices?.includes(index)
                    ? 'bg-blue-400 text-white'
                    : ''
                } border hover:border-blue-400 w-full h-32 select-none ${
                  isViewingHistory ? 'bg-gray-100' : 'cursor-pointer'
                }`}
                key={index}
                onClick={tick(index)}
              >
                <div className="grid place-content-center text-4xl h-full">
                  {selectedHistory.data[index]}
                </div>
              </div>
            ))}
        </div>
        <History
          onResetHistory={reset}
          isViewing={isViewingHistory}
          onViewHistory={setIsViewingHistory}
          selected={selectedHistory}
          data={history}
          onClick={setSelectedHistory}
        />
      </div>
    </div>
  );
}
