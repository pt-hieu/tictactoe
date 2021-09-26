/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from 'react';
import { HistoryState } from '../GameBoard';

interface Props {
  data: HistoryState;
  onResetHistory: () => void;
  isViewing: boolean;
  selected?: HistoryState[number];
  onViewHistory: (o: boolean | ((o: boolean) => boolean)) => void;
  onClick: (
    o:
      | HistoryState[number]
      | ((o: HistoryState[number]) => HistoryState[number])
  ) => void;
}

const parseLocation = (index: number) => ({
  c: (index % 3) + 1,
  r: Math.floor(index / 3) + 1,
});

export default function History({
  data,
  onClick: select,
  selected,
  onViewHistory: setViewingHistory,
  isViewing,
  onResetHistory: reset,
}: Props) {
  const [sort, setSort] = useState<'asc' | 'des'>('asc');

  const parsedData = useMemo(
    () => (sort === 'asc' ? [...data] : [...data].reverse()),
    [sort, data]
  );

  const rewind = useCallback(
    (index: number) => () => {
      select(parsedData[index]);

      if (sort === 'des') {
        setViewingHistory(index !== 0);
        return;
      }

      setViewingHistory(index !== data.length - 1);
    },
    [parsedData, sort]
  );

  return (
    <div>
      History{' '}
      <span
        onClick={() => setSort((s) => (s === 'asc' ? 'des' : 'asc'))}
        role="button"
      >
        {sort === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}
      </span>
      <button
        className="ml-16 px-2 py-1 rounded-md bg-blue-400 text-white"
        onClick={reset}
      >
        Reset
      </button>
      <div className="mt-3 italic text-gray-400">
        {data.length === 1 && 'History Empty'}
      </div>
      <div className="flex flex-col gap-3 h-80 overflow-y-auto w-48 pr-3">
        {parsedData.map(
          ({ id, location }, index) =>
            (sort === 'asc' ? !!index : index !== parsedData.length - 1) && (
              <button
                className={`px-3 py-1 bg-gray-100 ${
                  isViewing && id === selected?.id ? 'bg-gray-300' : ''
                }`}
                key={id}
                onClick={rewind(index)}
              >
                Step {index} ({parseLocation(location || 0).c},{' '}
                {parseLocation(location || 0).r})
              </button>
            )
        )}
      </div>
    </div>
  );
}
