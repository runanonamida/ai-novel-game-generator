# AI Novel Game Generator

AIがオリジナルのビジュアルノベルゲームを生成し、ショート動画として出力するWebサービスです。

## 主な機能

- **🎮 AIビジュアルノベル生成**: Gemini 2.5 Flash APIを使用してキャラクター、背景、ストーリーを自動生成
- **🎬 動画出力機能**: 生成されたノベルゲームをWebM/MP4形式の動画として出力
- **🎭 表情差分システム**: キャラクターがセリフの感情に応じて表情を変える
- **🖼️ 豊富な背景**: 10種類以上のジャンルに対応した背景画像
- **📱 SNS対応**: X/Twitter、TikTok、YouTube Shorts向けの縦型動画（9:16）
- **🎨 カスタマイズ機能**: ジャンル、雰囲気、キャラクター、設定をカスタマイズ可能

## 技術スタック

### フロントエンド
- React 19 (TypeScript)
- HTML5 Canvas (動画生成)
- MediaRecorder API (動画録画)
- CSS3 (カスタムスタイル)
- Axios (API通信)

### バックエンド
- Node.js + Express.js
- Google Generative AI (Gemini 2.5 Flash)
- FFmpeg (動画処理 - オプション)
- Multer (ファイルアップロード)

### デプロイ
- Railway / Vercel 対応
- Docker対応

## セットアップ

### 前提条件
- Node.js (v16以上)
- Gemini API Key

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd ai-novel-game-generator
```

2. 依存関係をインストール
```bash
npm run install-all
```

3. 環境変数を設定
```bash
cp .env.example .env
```

`.env`ファイルを編集してGemini API Keyを設定:
```
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=5000
```

### 開発環境での起動

```bash
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:5000

### 本番ビルド

```bash
npm run build
npm start
```

## Railway デプロイ

1. Railway プロジェクトを作成
2. 環境変数 `GEMINI_API_KEY` を設定
3. リポジトリを接続してデプロイ

## API エンドポイント

### POST /api/novel/generate
ビジュアルノベルゲームを生成します。

**リクエストボディ:**
```json
{
  "genre": "ファンタジー",
  "characters": "主人公とヒロイン",
  "setting": "魔法学院",
  "mood": "明るい",
  "customInput": "追加要素",
  "storyLength": "short"
}
```

**レスポンス:**
```json
{
  "success": true,
  "game": {
    "id": "1234567890",
    "title": "魔法学院の冒険",
    "description": "ゲームの説明",
    "scenes": [...],
    "characters": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "shareUrl": "https://example.com/novel/1234567890"
}
```

### POST /api/video/generate
動画ファイルを生成します（FFmpeg必須）。

### GET /api/novel/:id
特定のビジュアルノベルゲームを取得します。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。