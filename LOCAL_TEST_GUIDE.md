# ローカルテスト手順

## 1. 必要な準備

### Node.jsのインストール確認
```bash
node --version
npm --version
```
- Node.js v16以上が必要です

### Gemini API Keyの取得
1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. 「Create API Key」をクリック
3. API Keyをコピー

## 2. セットアップ

### 1. 依存関係のインストール
```bash
cd github-ready
npm run install-all
```

### 2. 環境変数の設定
```bash
cp .env.example .env
```

`.env`ファイルを編集:
```
GEMINI_API_KEY=あなたのAPIキーをここに入力
NODE_ENV=development
PORT=5000
```

## 3. 開発サーバーの起動

### 方法1: 同時起動（推奨）
```bash
npm run dev
```

### 方法2: 個別起動
**ターミナル1（バックエンド）:**
```bash
npm run server
```

**ターミナル2（フロントエンド）:**
```bash
npm run client
```

## 4. アクセス確認

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:5000

## 5. テスト手順

### 基本動作テスト
1. http://localhost:3000 にアクセス
2. フォームに以下を入力:
   - ジャンル: 「ファンタジー」
   - キーワード: 「魔法, 冒険」
   - キャラクター: 「勇者と魔法使い」
   - 雰囲気: 「明るい」
3. 「ストーリーを生成する」ボタンをクリック
4. AIがストーリーを生成するまで待機
5. 生成されたストーリーが表示されることを確認

### シェア機能テスト
1. ストーリー生成後
2. 「Twitterでシェア」ボタンをクリック
3. Twitterの投稿画面が開くことを確認
4. 「テキストをコピー」ボタンをクリック
5. クリップボードにテキストがコピーされることを確認

## 6. トラブルシューティング

### エラー: "Module not found"
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

### エラー: "API Key not found"
- `.env`ファイルが存在するか確認
- `GEMINI_API_KEY`が正しく設定されているか確認
- サーバーを再起動

### エラー: "Port already in use"
```bash
# プロセスを確認
lsof -i :3000
lsof -i :5000

# プロセスを終了
kill -9 <PID>
```

### フロントエンドが表示されない
1. ブラウザのキャッシュをクリア
2. http://localhost:3000 に直接アクセス
3. 開発者ツールでエラーを確認

## 7. 動作確認チェックリスト

- [ ] サーバーが起動する
- [ ] フロントエンドが表示される
- [ ] フォーム入力ができる
- [ ] ストーリー生成ボタンが動作する
- [ ] AIがストーリーを生成する
- [ ] 生成されたストーリーが表示される
- [ ] 「新しいストーリーを作る」ボタンが動作する
- [ ] Twitterシェアボタンが動作する
- [ ] テキストコピーボタンが動作する
- [ ] URLコピーボタンが動作する

## 8. 停止方法

開発サーバーを停止するには:
```bash
Ctrl + C
```