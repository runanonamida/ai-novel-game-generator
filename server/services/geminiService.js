const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const stories = new Map();

const generateStoryPrompt = (params) => {
  const { genre, keywords, characters, mood, customInput } = params;
  
  return `
あなたは優秀な小説家です。以下の条件に基づいて、1分程度で読めるノベルゲーム風の短編ストーリーを作成してください。

【条件】
- ジャンル: ${genre || 'ファンタジー'}
- キーワード: ${keywords || '冒険'}
- キャラクター設定: ${characters || '主人公とその仲間'}
- 雰囲気: ${mood || '明るい'}
- 追加要素: ${customInput || '特になし'}

【出力形式】
- セリフ中心で構成
- 場面描写は簡潔に
- YouTubeやTikTokでの動画化に適した構成
- 全体で300-500文字程度
- 起承転結を意識した構成

【注意事項】
- 読者が感情移入しやすい内容
- SNSでシェアしたくなるような印象的な結末
- 適度にセリフを含める

ストーリーを作成してください：
`;
};

const generateStory = async (params) => {
  try {
    const prompt = generateStoryPrompt(params);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const story = {
      id: Date.now().toString(),
      title: `${params.genre || 'ファンタジー'}の物語`,
      content: text,
      genre: params.genre,
      keywords: params.keywords,
      createdAt: new Date().toISOString()
    };
    
    stories.set(story.id, story);
    
    return story;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI story generation failed');
  }
};

const getStory = async (id) => {
  return stories.get(id);
};

module.exports = {
  generateStory,
  getStory
};