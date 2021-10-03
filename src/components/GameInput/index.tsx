import { ChangeEventHandler, useCallback, useState } from 'react';

interface Props {
  onSubmit: (v: number) => void;
}

export default function GameInput({ onSubmit: setGameBoard }: Props) {
  const [size, setSize] = useState<number>(3);

  const changeSize: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSize(parseInt(e.target.value));
  }, []);

  const submitGameboard = useCallback(() => {
    if (size < 3) {
      alert('Invalid size');
      return;
    }

    setGameBoard(size);
  }, [size, setGameBoard]);

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="text-center font-bold text-blue-400 text-2xl">
        Welcome to The Tic Tac Toe Game
      </div>
      <label htmlFor="size" className="my-2 font-medium ">
        Please input your desired game board
        <br />
        (Plese notice, the best screen sizes are 3x3, 4x4 and 5x5, we still have
        sizes up to 20x20 but any screen size bigger than the supported ones
        will cause the screen to overflow, the UX will be downgrade as a
        consequence):
      </label>
      <input
        type="number"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-600"
        id="size"
        onChange={changeSize}
        value={size}
      />
      <button
        className="w-full px-3 py-2 text-white bg-blue-400 rounded-md font-semibold mt-3"
        onClick={submitGameboard}
      >
        Submit
      </button>
    </div>
  );
}
