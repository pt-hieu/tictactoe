import { useState } from 'react';
import GameBoard from './components/GameBoard';
import GameInput from './components/GameInput';

function App() {
  const [gameBoard, setGameboard] = useState<number>();

  if (!gameBoard) return <GameInput onSubmit={setGameboard} />;
  return <GameBoard gameboard={gameBoard} />;
}

export default App;
