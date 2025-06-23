import React, { useState } from 'react';
import axios from 'axios';
import { NovelGame, StoryGenerationParams, StoryResponse } from '../types';

interface Props {
  onGameGenerated: (game: NovelGame) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const GameSetup: React.FC<Props> = ({ onGameGenerated, isGenerating, setIsGenerating }) => {
  const [formData, setFormData] = useState<StoryGenerationParams>({
    genre: 'ファンタジー',
    characters: '',
    setting: '',
    mood: '明るい',
    customInput: '',
    storyLength: 'short'
  });

  const [customGenre, setCustomGenre] = useState('');

  const genres = [
    'ファンタジー', 'SF', 'ミステリー', 'ロマンス', 'ホラー', 
    '学園もの', '異世界', 'サスペンス', 'コメディ', '時代劇', 'その他'
  ];

  const moods = [
    '明るい', '暗い', '切ない', 'コミカル', 'シリアス', 
    'ドラマチック', '神秘的', 'スリリング', 'ほのぼの', '感動的'
  ];

  const storyLengths = [
    { value: 'short', label: 'ショート (45秒動画向け)', description: '1-2シーン、4-6会話、簡潔な展開' },
    { value: 'medium', label: 'ミディアム (1分動画向け)', description: '2-3シーン、程よい展開' },
    { value: 'full', label: 'フル (5分+動画向け)', description: '5-8シーン、充実した展開' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // ジャンルが「その他」の場合は、カスタムジャンルを使用
      const submissionData = {
        ...formData,
        genre: formData.genre === 'その他' ? customGenre : formData.genre
      };

      const response = await axios.post<StoryResponse>('/api/novel/generate', submissionData);
      
      if (response.data.success) {
        onGameGenerated(response.data.game);
      } else {
        alert('ゲーム生成に失敗しました: ' + response.data.error);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Game generation error:', error);
      alert('ゲーム生成に失敗しました');
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="game-setup">
        <div className="setup-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">AIがノベルゲームを生成中...</div>
            <p style={{marginTop: '10px', color: '#666'}}>
              キャラクター、背景、ストーリーを作成しています
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-setup">
      <div className="setup-card">
        <div className="setup-header">
          <h1>AI Novel Game Generator</h1>
          <p>AIがあなただけのオリジナルビジュアルノベルを生成します</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="genre">ジャンル</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="form-control"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            {formData.genre === 'その他' && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  placeholder="カスタムジャンルを入力してください（例: サイバーパンク、スチームパンク、日常系）"
                  className="form-control"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="characters">キャラクター設定</label>
            <input
              type="text"
              id="characters"
              name="characters"
              value={formData.characters}
              onChange={handleChange}
              placeholder="例: 主人公の魔法使いアリサと騎士ライアン"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="setting">舞台・設定</label>
            <input
              type="text"
              id="setting"
              name="setting"
              value={formData.setting}
              onChange={handleChange}
              placeholder="例: 魔法学院、現代の東京、異世界の王国"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mood">雰囲気</label>
            <select
              id="mood"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="form-control"
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="storyLength">ストーリーの長さ</label>
            <select
              id="storyLength"
              name="storyLength"
              value={formData.storyLength}
              onChange={handleChange}
              className="form-control"
            >
              {storyLengths.map(length => (
                <option key={length.value} value={length.value}>
                  {length.label}
                </option>
              ))}
            </select>
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {storyLengths.find(l => l.value === formData.storyLength)?.description}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="customInput">追加要素（自由入力）</label>
            <textarea
              id="customInput"
              name="customInput"
              value={formData.customInput}
              onChange={handleChange}
              placeholder="特定のシーンや展開、キャラクターの関係性など、追加したい要素があれば自由に入力してください"
              className="form-control"
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            className="generate-button" 
            disabled={isGenerating || (formData.genre === 'その他' && !customGenre.trim())}
          >
            ノベルゲームを生成する
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameSetup;