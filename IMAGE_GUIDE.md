# 画像ファイル配置ガイド

## キャラクター画像

以下のファイルを `client/public/images/characters/` に配置してください：

### 基本キャラクター
- `protagonist_male.png` - 主人公（男性）
- `protagonist_female.png` - 主人公（女性）
- `heroine.png` - ヒロイン
- `hero.png` - ヒーロー
- `friend.png` - 友人
- `rival.png` - ライバル
- `senior.png` - 先輩

### 推奨仕様
- **画像サイズ**: 幅300px以下、高さ600-800px程度
- **ファイル形式**: PNG（透明背景推奨）
- **スタイル**: アニメ/イラスト調
- **ポーズ**: 立ち絵、正面または斜め向き

### 感情表現バリエーション（オプション）
各キャラクターに以下の感情バリエーションを追加可能：
- `キャラクター名_happy.png` - 喜び
- `キャラクター名_sad.png` - 悲しみ
- `キャラクター名_angry.png` - 怒り
- `キャラクター名_surprised.png` - 驚き

## 背景画像

以下のファイルを `client/public/images/backgrounds/` に配置してください：

### 基本背景
- `school_classroom.png` - 教室
- `school_hallway.png` - 学校廊下
- `city_street.png` - 街並み
- `park.png` - 公園
- `home_room.png` - 自宅・部屋
- `cafe.png` - カフェ
- `library.png` - 図書館
- `rooftop.png` - 屋上

### 特殊背景
- `sunset_view.png` - 夕景
- `night_street.png` - 夜景
- `fantasy_forest.png` - 幻想的な森
- `magic_academy.png` - 魔法学院

### 推奨仕様
- **画像サイズ**: 1920x1080px以上
- **ファイル形式**: PNG
- **スタイル**: アニメ背景調またはリアル調
- **明度**: キャラクターが見やすい明度

## ディレクトリ構造

```
client/public/images/
├── characters/
│   ├── protagonist_male.png
│   ├── protagonist_female.png
│   ├── heroine.png
│   ├── hero.png
│   ├── friend.png
│   ├── rival.png
│   └── senior.png
└── backgrounds/
    ├── school_classroom.png
    ├── school_hallway.png
    ├── city_street.png
    ├── park.png
    ├── home_room.png
    ├── cafe.png
    ├── library.png
    ├── rooftop.png
    ├── sunset_view.png
    ├── night_street.png
    ├── fantasy_forest.png
    └── magic_academy.png
```

## 画像が見つからない場合

画像ファイルが見つからない場合は、システムが自動的に代替画像を表示します。

## 追加・カスタマイズ

- 追加のキャラクターや背景は `client/src/data/gameAssets.ts` ファイルで設定可能
- ジャンル別の背景マッピングも同ファイルでカスタマイズ可能