/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { generateIndices } from '../../libs/indices';
import History from '../History';

export type BoardState = Array<'X' | 'O' | undefined>;

export type HistoryState = Array<{
  data: BoardState;
  location: number | null;
  id: number;
}>;

function checkGameBoard(board: BoardState, size: number, ...indices: number[]) {
  const str = indices.map((index) => board[index]).join('');
  return (
    str === Array(size).fill('X').join('') ||
    str === Array(size).fill('O').join('')
  );
}

interface Props {
  gameboard: number;
}

export default function GameBoard({ gameboard }: Props) {
  const [isCurrentPlayerX, setIsCurrentPlayerX] = useState(false);
  const [winIndices, setWinIndices] = useState<Array<number>>();

  const [isWin, setIsWin] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const [history, setHistory] = useState<HistoryState>(() => [
    {
      id: Date.now(),
      data: Array(gameboard * gameboard).fill(undefined),
      location: null,
    },
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

  console.log(generateIndices(4));

  const reset = useCallback(() => {
    setIsWin(false);
    setIsDraw(false);
    setIsViewingHistory(false);
    setWinIndices([]);
    setHistory([
      {
        id: Date.now(),
        data: Array(gameboard * gameboard).fill(undefined),
        location: null,
      },
    ]);
  }, [gameboard]);

  useEffect(() => {
    setSelectedHistory(history[history.length - 1]);
  }, [history]);

  useEffect(() => {
    const win = generateIndices(gameboard).find((item) =>
      checkGameBoard(selectedHistory.data, gameboard, ...item)
    );

    if (win) {
      setIsWin(true);
      setWinIndices(win);
      return;
    }

    if (selectedHistory.data.every((item) => item !== undefined)) {
      setIsDraw(true);
    }
  }, [selectedHistory, gameboard]);

  console.log(generateIndices(4));

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="font-medium text-2xl">The Tic Tac Toe Game</div>

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
        <div
          className="grid shadow-md"
          style={{
            width: gameboard * 126 + 'px',
            gridTemplateColumns: `repeat(${gameboard}, minmax(0, 1fr)`,
          }}
        >
          {Array(gameboard * gameboard)
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
