import React, { useState, useEffect } from 'react';
import { NovelGame, Scene, DialogueLine, Character } from '../types';
import VideoGenerator from './VideoGenerator';

interface Props {
  game: NovelGame;
  onNewGame: () => void;
}

const NovelGamePlayer: React.FC<Props> = ({ game, onNewGame }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);

  const currentScene = game.scenes[currentSceneIndex];
  const currentDialogue = currentScene?.dialogues[currentDialogueIndex];

  // テキストタイピング効果
  useEffect(() => {
    if (!currentDialogue) return;

    setIsTyping(true);
    setDisplayedText('');
    setShowChoices(false);

    let index = 0;
    const text = currentDialogue.text;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (currentDialogue.type === 'choice' && currentDialogue.choices) {
          setShowChoices(true);
        }
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentDialogue]);

  const handleNext = () => {
    if (isTyping) {
      // タイピング中なら即座に全文表示
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      if (currentDialogue.type === 'choice' && currentDialogue.choices) {
        setShowChoices(true);
      }
      return;
    }

    if (currentDialogueIndex < currentScene.dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else if (currentSceneIndex < game.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setCurrentDialogueIndex(0);
    }
  };

  const handleChoice = (choiceId: string) => {
    // 選択肢を非表示にして次に進む
    setShowChoices(false);
    
    // 選択肢の結果をローカルストレージに保存（将来の分岐処理用）
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    gameProgress[`${currentSceneIndex}_${currentDialogueIndex}`] = choiceId;
    localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
    
    // 次のダイアログに進む
    handleNext();
  };

  const shareGame = () => {
    const shareText = `AIが生成したオリジナルノベルゲーム「${game.title}」をプレイしました！ #AINovelGame`;
    const shareUrl = window.location.href;
    
    // Web Share API をサポートしているかチェック
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: shareText,
        url: shareUrl
      }).catch(console.error);
    } else {
      // フォールバック: Twitter シェア
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const isGameEnd = currentSceneIndex >= game.scenes.length - 1 && 
                   currentDialogueIndex >= currentScene?.dialogues.length - 1;

  // キャラクターの表示位置を決定
  const getCharacterPosition = (character: Character | undefined): string => {
    if (!character) return '';
    return `character ${character.position} ${currentDialogue?.character?.id === character.id ? 'speaking' : ''}`;
  };

  if (!currentScene || !currentDialogue) {
    return (
      <div className="novel-game-container">
        <div className="dialogue-box">
          <div className="dialogue-text">ゲーム終了</div>
          <div className="game-controls">
            <button onClick={onNewGame} className="next-button">
              新しいゲームを作る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="novel-game-container" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* 背景 */}
      <div 
        className="game-background" 
        style={{ 
          backgroundImage: currentScene.background ? `url(${currentScene.background})` : 'none',
          backgroundColor: '#1a1a2e' // フォールバック背景色
        }}
        onError={() => console.log('Background image failed to load:', currentScene.background)}
      />
      {/* デバッグ情報 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 999 }}>
          Background: {currentScene.background || 'No background'}
        </div>
      )}

      {/* キャラクター表示層 */}
      <div className="characters-layer">
        {game.characters.map(character => {
          const isVisible = currentDialogue.character?.id === character.id;
          return isVisible ? (
            <img
              key={character.id}
              src={character.image}
              alt={character.name}
              className={getCharacterPosition(character)}
              onError={(e) => {
                // 画像が見つからない場合のフォールバック
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEE5MEUyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iMTAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNoYXJhY3RlcjwvdGV4dD4KPHN2Zz4K';
              }}
            />
          ) : null;
        })}
      </div>

      {/* ダイアログボックス */}
      <div className="dialogue-box">
        {currentDialogue.character && (
          <div className="character-name">
            {currentDialogue.character.name}
          </div>
        )}
        
        <div className="dialogue-text">
          {displayedText}
        </div>

        {showChoices && currentDialogue.choices && !isTyping ? (
          <div className="choices-container">
            {currentDialogue.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className="choice-button"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="game-controls">
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              {showChoices ? '選択肢を選んでください' : 'スペースキーまたはクリックで進む'}
            </div>
            
            {!showChoices && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {isGameEnd ? (
                  <button onClick={onNewGame} className="next-button">
                    新しいゲームを作る
                  </button>
                ) : (
                  <button onClick={handleNext} className="next-button">
                    {isTyping ? '▶' : '次へ'}
                  </button>
                )}
                
                <button 
                  onClick={onNewGame} 
                  className="next-button"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  タイトルに戻る
                </button>
                
                <button 
                  onClick={() => shareGame()}
                  className="next-button"
                  style={{ background: 'rgba(29, 161, 242, 0.8)' }}
                >
                  シェア
                </button>
                
                <button 
                  onClick={() => setShowVideoGenerator(true)}
                  className="next-button"
                  style={{ background: 'rgba(255, 69, 0, 0.8)' }}
                >
                  動画作成
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showVideoGenerator && (
        <VideoGenerator 
          game={game} 
          onClose={() => setShowVideoGenerator(false)} 
        />
      )}
    </div>
  );
};

export default NovelGamePlayer;