import React from 'react';
import GameBoard from './components/GameBoard/GameBoard';
import { GameProvider } from './hooks/useGameState';
import './styles/globals.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameBoard />
      </div>
    </GameProvider>
  );
}

export default App;
