export interface Character {
  id: string;
  name: string;
  image: string;
  position: 'left' | 'center' | 'right';
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised';
}

export interface DialogueLine {
  id: string;
  character?: Character;
  text: string;
  type: 'dialogue' | 'narration' | 'choice';
  choices?: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId?: string;
}

export interface Scene {
  id: string;
  background: string;
  bgm?: string;
  dialogues: DialogueLine[];
}

export interface NovelGame {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  characters: Character[];
  createdAt: string;
}

export interface StoryGenerationParams {
  genre: string;
  characters: string;
  setting: string;
  mood: string;
  customInput: string;
  storyLength: 'short' | 'medium' | 'full';
}

export interface StoryResponse {
  success: boolean;
  game: NovelGame;
  shareUrl: string;
  error?: string;
}

// 旧バージョンとの互換性のため
export interface Story {
  id: string;
  title: string;
  content: string;
  genre: string;
  keywords: string;
  createdAt: string;
}