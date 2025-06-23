import React, { useState } from 'react';
import GameSetup from './components/GameSetup';
import NovelGamePlayer from './components/NovelGamePlayer';
import { NovelGame } from './types';

const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<NovelGame | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGameGenerated = (game: NovelGame) => {
    setCurrentGame(game);
    setIsGenerating(false);
  };

  const handleNewGame = () => {
    setCurrentGame(null);
  };

  return (
    <div className="App">
      {!currentGame ? (
        <GameSetup 
          onGameGenerated={handleGameGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      ) : (
        <NovelGamePlayer 
          game={currentGame}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default App;