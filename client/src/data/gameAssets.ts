// ゲーム用素材の定義
export const CHARACTERS = {
  // 主人公
  protagonist_male: {
    id: 'protagonist_male',
    name: '主人公（男）',
    image: '/images/characters/protagonist_male.png',
    emotions: {
      normal: '/images/characters/protagonist_male.png',
      happy: '/images/characters/protagonist_male_happy.png',
      sad: '/images/characters/protagonist_male_sad.png',
      angry: '/images/characters/protagonist_male_angry.png',
      surprised: '/images/characters/protagonist_male_surprised.png'
    }
  },
  protagonist_female: {
    id: 'protagonist_female',
    name: '主人公（女）',
    image: '/images/characters/protagonist_female.png',
    emotions: {
      normal: '/images/characters/protagonist_female.png',
      happy: '/images/characters/protagonist_female_happy.png',
      sad: '/images/characters/protagonist_female_sad.png',
      angry: '/images/characters/protagonist_female_angry.png',
      surprised: '/images/characters/protagonist_female_surprised.png'
    }
  },
  // ヒロイン/ヒーロー
  heroine: {
    id: 'heroine',
    name: 'ヒロイン',
    image: '/images/characters/heroine.png',
    emotions: {
      normal: '/images/characters/heroine.png',
      happy: '/images/characters/heroine_happy.png',
      sad: '/images/characters/heroine_sad.png',
      angry: '/images/characters/heroine_angry.png',
      surprised: '/images/characters/heroine_surprised.png'
    }
  },
  hero: {
    id: 'hero',
    name: 'ヒーロー',
    image: '/images/characters/hero.png',
    emotions: {
      normal: '/images/characters/hero.png',
      happy: '/images/characters/hero_happy.png',
      sad: '/images/characters/hero_sad.png',
      angry: '/images/characters/hero_angry.png',
      surprised: '/images/characters/hero_surprised.png'
    }
  },
  // 友人
  friend: {
    id: 'friend',
    name: '友人',
    image: '/images/characters/friend.png',
    emotions: {
      normal: '/images/characters/friend.png',
      happy: '/images/characters/friend_happy.png',
      sad: '/images/characters/friend_sad.png',
      angry: '/images/characters/friend_angry.png',
      surprised: '/images/characters/friend_surprised.png'
    }
  },
  // ライバル
  rival: {
    id: 'rival',
    name: 'ライバル',
    image: '/images/characters/rival.png',
    emotions: {
      normal: '/images/characters/rival.png',
      happy: '/images/characters/rival_happy.png',
      sad: '/images/characters/rival_sad.png',
      angry: '/images/characters/rival_angry.png',
      surprised: '/images/characters/rival_surprised.png'
    }
  },
  // 年上キャラ
  senior: {
    id: 'senior',
    name: '先輩',
    image: '/images/characters/senior.png',
    emotions: {
      normal: '/images/characters/senior.png',
      happy: '/images/characters/senior_happy.png',
      sad: '/images/characters/senior_sad.png',
      angry: '/images/characters/senior_angry.png',
      surprised: '/images/characters/senior_surprised.png'
    }
  }
};

export const BACKGROUNDS = {
  school_classroom: '/images/backgrounds/school_classroom.jpg',
  school_hallway: '/images/backgrounds/school_hallway.jpg',
  city_street: '/images/backgrounds/city_street.jpg',
  park: '/images/backgrounds/park.jpg',
  home_room: '/images/backgrounds/home_room.jpg',
  cafe: '/images/backgrounds/cafe.jpg',
  library: '/images/backgrounds/library.jpg',
  rooftop: '/images/backgrounds/rooftop.jpg',
  sunset_view: '/images/backgrounds/sunset_view.jpg',
  night_street: '/images/backgrounds/night_street.jpg',
  fantasy_forest: '/images/backgrounds/fantasy_forest.jpg',
  magic_academy: '/images/backgrounds/magic_academy.jpg'
};

// ジャンル別背景マッピング
export const GENRE_BACKGROUNDS = {
  '学園もの': [
    BACKGROUNDS.school_classroom,
    BACKGROUNDS.school_hallway,
    BACKGROUNDS.library,
    BACKGROUNDS.rooftop
  ],
  'ファンタジー': [
    BACKGROUNDS.fantasy_forest,
    BACKGROUNDS.magic_academy,
    BACKGROUNDS.sunset_view
  ],
  '現代': [
    BACKGROUNDS.city_street,
    BACKGROUNDS.park,
    BACKGROUNDS.cafe,
    BACKGROUNDS.home_room
  ],
  'ロマンス': [
    BACKGROUNDS.park,
    BACKGROUNDS.cafe,
    BACKGROUNDS.sunset_view,
    BACKGROUNDS.rooftop
  ],
  'SF': [
    BACKGROUNDS.city_street,
    BACKGROUNDS.night_street,
    BACKGROUNDS.rooftop
  ]
};

// デフォルト画像（画像が見つからない場合の代替）
export const DEFAULT_CHARACTER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEE5MEUyIiBvcGFjaXR5PSIwLjMiLz4KPGNPCLE+Q2hhcmFjdGVyPC90ZXh0Pgo8L3N2Zz4K';

export const DEFAULT_BACKGROUND_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSJ1cmwoI2JnKSIvPgo8dGV4dCB4PSI2MDAiIHk9IjQwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgb3BhY2l0eT0iMC41Ij5CYWNrZ3JvdW5kPC90ZXh0Pgo8L3N2Zz4K';