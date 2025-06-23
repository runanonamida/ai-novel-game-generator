const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const games = new Map();

// 利用可能なキャラクターと背景
const AVAILABLE_CHARACTERS = [
  { id: 'protagonist_male', name: '主人公（男）', image: '/images/characters/protagonist_male.png' },
  { id: 'protagonist_female', name: '主人公（女）', image: '/images/characters/protagonist_female.png' },
  { id: 'heroine', name: 'ヒロイン', image: '/images/characters/heroine.png' },
  { id: 'hero', name: 'ヒーロー', image: '/images/characters/hero.png' },
  { id: 'friend', name: '友人', image: '/images/characters/friend.png' },
  { id: 'rival', name: 'ライバル', image: '/images/characters/rival.png' },
  { id: 'senior', name: '先輩', image: '/images/characters/senior.png' }
];

const AVAILABLE_BACKGROUNDS = {
  '学園もの': [
    '/images/backgrounds/school_classroom.png',
    '/images/backgrounds/school_hallway.png',
    '/images/backgrounds/library.png',
    '/images/backgrounds/rooftop.png',
    '/images/backgrounds/school_courtyard.png',
    '/images/backgrounds/gymnasium.png'
  ],
  'ファンタジー': [
    '/images/backgrounds/fantasy_forest.png',
    '/images/backgrounds/magic_academy.png',
    '/images/backgrounds/sunset_view.png',
    '/images/backgrounds/medieval_castle.png',
    '/images/backgrounds/enchanted_garden.png',
    '/images/backgrounds/mystical_cave.png',
    '/images/backgrounds/ancient_temple.png'
  ],
  '現代': [
    '/images/backgrounds/city_street.png',
    '/images/backgrounds/park.png',
    '/images/backgrounds/cafe.png',
    '/images/backgrounds/home_room.png',
    '/images/backgrounds/train_station.png',
    '/images/backgrounds/shopping_mall.png',
    '/images/backgrounds/apartment_balcony.png'
  ],
  'SF': [
    '/images/backgrounds/city_street.png',
    '/images/backgrounds/night_street.png',
    '/images/backgrounds/rooftop.png',
    '/images/backgrounds/space_station.png',
    '/images/backgrounds/cyberpunk_city.png',
    '/images/backgrounds/laboratory.png',
    '/images/backgrounds/alien_planet.png'
  ],
  'ロマンス': [
    '/images/backgrounds/park.png',
    '/images/backgrounds/cafe.png',
    '/images/backgrounds/sunset_view.png',
    '/images/backgrounds/beach_sunset.png',
    '/images/backgrounds/flower_garden.png',
    '/images/backgrounds/romantic_restaurant.png'
  ],
  'ミステリー': [
    '/images/backgrounds/dark_alley.png',
    '/images/backgrounds/old_mansion.png',
    '/images/backgrounds/detective_office.png',
    '/images/backgrounds/abandoned_warehouse.png',
    '/images/backgrounds/foggy_street.png'
  ],
  'ホラー': [
    '/images/backgrounds/haunted_house.png',
    '/images/backgrounds/dark_forest.png',
    '/images/backgrounds/cemetery.png',
    '/images/backgrounds/abandoned_hospital.png'
  ],
  '異世界': [
    '/images/backgrounds/otherworld_sky.png',
    '/images/backgrounds/floating_islands.png',
    '/images/backgrounds/crystal_cavern.png',
    '/images/backgrounds/magical_library.png'
  ],
  'サスペンス': [
    '/images/backgrounds/corporate_office.png',
    '/images/backgrounds/underground_tunnel.png',
    '/images/backgrounds/hotel_lobby.png'
  ],
  'コメディ': [
    '/images/backgrounds/comedy_stage.png',
    '/images/backgrounds/family_restaurant.png',
    '/images/backgrounds/amusement_park.png'
  ],
  '時代劇': [
    '/images/backgrounds/edo_street.png',
    '/images/backgrounds/japanese_temple.png',
    '/images/backgrounds/samurai_dojo.png'
  ],
  // デフォルト背景（フォールバック）
  'default': [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjYmcpIi8+PC9zdmc+'
  ]
};

const generateNovelGamePrompt = (params) => {
  const { genre, characters, setting, mood, customInput, storyLength } = params;
  
  // ストーリーの長さに応じた設定
  const lengthSettings = {
    short: {
      scenes: '1-2シーン',
      dialogues: '各シーン4-6個の会話',
      description: '短く簡潔で、核心的な展開に集中したストーリー（45秒動画用）'
    },
    medium: {
      scenes: '2-3シーン',
      dialogues: '各シーン3-5個の会話',
      description: '程よい長さで、起承転結がしっかりしたストーリー'
    },
    full: {
      scenes: '5-8シーン',
      dialogues: '各シーン8-12個の会話',
      description: '充実した展開で、キャラクター関係や世界観を深く掘り下げたストーリー'
    }
  };

  const settings = lengthSettings[storyLength] || lengthSettings.short;
  
  return `
あなたは優秀なビジュアルノベルゲームの脚本家です。以下の条件に基づいて、ビジュアルノベルゲーム用の脚本を作成してください。

【条件】
- ジャンル: ${genre || 'ファンタジー'}
- キャラクター設定: ${characters || '主人公とヒロイン'}
- 舞台・設定: ${setting || '学校'}
- 雰囲気: ${mood || '明るい'}
- 追加要素: ${customInput || '特になし'}
- ストーリーの長さ: ${settings.description}

【出力形式】
以下のJSON形式で出力してください：

{
  "title": "ゲームタイトル",
  "description": "ゲームの簡単な説明",
  "characters": [
    {
      "id": "character1",
      "name": "キャラクター名",
      "description": "キャラクターの説明"
    }
  ],
  "scenes": [
    {
      "id": "scene1",
      "description": "シーンの説明",
      "dialogues": [
        {
          "id": "dialogue1",
          "characterId": "character1または null（ナレーション）",
          "text": "セリフまたはナレーション",
          "emotion": "normal, happy, sad, angry, surprised のいずれか",
          "type": "dialogue"
        },
        {
          "id": "choice1",
          "text": "選択肢の説明文",
          "type": "choice",
          "choices": [
            {
              "id": "choice1_1",
              "text": "選択肢1"
            },
            {
              "id": "choice1_2", 
              "text": "選択肢2"
            }
          ]
        }
      ]
    }
  ]
}

【重要な指示】
- ${settings.scenes}程度の構成にしてください
- ${settings.dialogues}を含めてください
- ${storyLength === 'short' ? '会話は30文字以内の短めのセリフにしてください' : 'キャラクター同士の関係性や感情の変化を表現してください'}
- ${storyLength === 'short' ? '0-1箇所' : storyLength === 'medium' ? '1-2箇所' : '2-3箇所'}で選択肢を入れて、プレイヤーが参加できるようにしてください
- ${storyLength === 'short' ? '1つの印象的な瞬間や感情を表現してください' : '感情的な盛り上がりがある展開にしてください'}
- **各ダイアログには必ずemotionフィールドを含めてください**（normal, happy, sad, angry, surprised のいずれか）
- セリフの内容と感情に応じて適切な表情を選択してください
- JSONのみを出力し、他のテキストは含めないでください

脚本を作成してください：
`;
};

const selectCharactersForStory = (storyCharacters) => {
  const selectedCharacters = [];
  
  storyCharacters.forEach((char, index) => {
    const availableChar = AVAILABLE_CHARACTERS[index % AVAILABLE_CHARACTERS.length];
    selectedCharacters.push({
      id: availableChar.id,
      name: char.name || availableChar.name,
      image: availableChar.image,
      position: index === 0 ? 'left' : index === 1 ? 'right' : 'center',
      emotion: 'normal'
    });
  });
  
  return selectedCharacters;
};

const selectBackgroundsForStory = (genre, mood, setting) => {
  let backgroundPool = [];
  
  // メインジャンルの背景を追加
  if (AVAILABLE_BACKGROUNDS[genre]) {
    backgroundPool.push(...AVAILABLE_BACKGROUNDS[genre]);
  }
  
  // 雰囲気に応じて追加の背景を選択
  const moodBackgrounds = {
    '明るい': ['現代', 'ロマンス', 'コメディ'],
    '暗い': ['ミステリー', 'ホラー', 'サスペンス'],
    '切ない': ['ロマンス', '現代'],
    'コミカル': ['コメディ', '現代'],
    'シリアス': ['サスペンス', 'ミステリー'],
    'ドラマチック': ['現代', 'ロマンス'],
    '神秘的': ['ファンタジー', '異世界'],
    'スリリング': ['サスペンス', 'ミステリー'],
    'ほのぼの': ['現代', 'コメディ'],
    '感動的': ['ロマンス', '現代']
  };
  
  if (moodBackgrounds[mood]) {
    moodBackgrounds[mood].forEach(additionalGenre => {
      if (AVAILABLE_BACKGROUNDS[additionalGenre]) {
        backgroundPool.push(...AVAILABLE_BACKGROUNDS[additionalGenre]);
      }
    });
  }
  
  // 設定に応じて追加の背景を選択
  const settingKeywords = setting ? setting.toLowerCase() : '';
  if (settingKeywords.includes('学校') || settingKeywords.includes('学園')) {
    if (AVAILABLE_BACKGROUNDS['学園もの']) {
      backgroundPool.push(...AVAILABLE_BACKGROUNDS['学園もの']);
    }
  }
  if (settingKeywords.includes('魔法') || settingKeywords.includes('ファンタジー')) {
    if (AVAILABLE_BACKGROUNDS['ファンタジー']) {
      backgroundPool.push(...AVAILABLE_BACKGROUNDS['ファンタジー']);
    }
  }
  if (settingKeywords.includes('未来') || settingKeywords.includes('宇宙')) {
    if (AVAILABLE_BACKGROUNDS['SF']) {
      backgroundPool.push(...AVAILABLE_BACKGROUNDS['SF']);
    }
  }
  
  // 重複を除去
  backgroundPool = [...new Set(backgroundPool)];
  
  // 背景が見つからない場合はデフォルトを使用
  if (backgroundPool.length === 0) {
    backgroundPool = AVAILABLE_BACKGROUNDS['現代'] || AVAILABLE_BACKGROUNDS['default'];
  }
  
  return backgroundPool;
};

const generateNovelGame = async (params) => {
  try {
    const prompt = generateNovelGamePrompt(params);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // JSONの抽出（マークダウンのコードブロックを除去）
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let storyData;
    try {
      storyData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      throw new Error('AIの応答をパースできませんでした');
    }
    
    // キャラクターとアセットの割り当て
    const gameCharacters = selectCharactersForStory(storyData.characters);
    const backgrounds = selectBackgroundsForStory(params.genre, params.mood, params.setting);
    
    // シーンにキャラクターと背景を割り当て
    const processedScenes = storyData.scenes.map((scene, sceneIndex) => {
      // より多様な背景選択のためにランダム要素を追加
      const backgroundIndex = (sceneIndex * 3 + Math.floor(Math.random() * 2)) % backgrounds.length;
      const background = backgrounds[backgroundIndex];
      console.log(`Scene ${sceneIndex}: Selected background (${backgroundIndex}/${backgrounds.length}):`, background); // デバッグログ
      
      const processedDialogues = scene.dialogues.map((dialogue, dialogueIndex) => {
        let character = null;
        
        if (dialogue.characterId && dialogue.characterId !== 'null') {
          // キャラクターIDから対応するキャラクターを検索
          const storyChar = storyData.characters.find(c => c.id === dialogue.characterId);
          if (storyChar) {
            const charIndex = storyData.characters.indexOf(storyChar);
            character = { ...gameCharacters[charIndex] };
            
            // 表情差分を適用
            const emotion = dialogue.emotion || 'normal';
            const validEmotions = ['normal', 'happy', 'sad', 'angry', 'surprised'];
            const selectedEmotion = validEmotions.includes(emotion) ? emotion : 'normal';
            
            // 画像パスに表情を反映（例: protagonist_male.png → protagonist_male_happy.png）
            if (selectedEmotion !== 'normal') {
              character.image = character.image.replace('.png', `_${selectedEmotion}.png`);
            }
            character.emotion = selectedEmotion;
          }
        }
        
        return {
          id: `dialogue_${sceneIndex}_${dialogueIndex}`,
          character: character,
          text: dialogue.text,
          type: dialogue.type || 'dialogue',
          choices: dialogue.choices || undefined
        };
      });
      
      return {
        id: `scene_${sceneIndex}`,
        background: background,
        dialogues: processedDialogues
      };
    });
    
    const novelGame = {
      id: Date.now().toString(),
      title: storyData.title,
      description: storyData.description,
      scenes: processedScenes,
      characters: gameCharacters,
      createdAt: new Date().toISOString()
    };
    
    games.set(novelGame.id, novelGame);
    
    return novelGame;
  } catch (error) {
    console.error('Novel game generation error:', error);
    throw new Error('ノベルゲーム生成に失敗しました');
  }
};

const getNovelGame = async (id) => {
  return games.get(id);
};

module.exports = {
  generateNovelGame,
  getNovelGame
};