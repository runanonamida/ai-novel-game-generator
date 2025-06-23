const express = require('express');
const router = express.Router();
const novelService = require('../services/novelService');

router.post('/generate', async (req, res) => {
  try {
    const { genre, characters, setting, mood, customInput, storyLength } = req.body;
    
    const novelGame = await novelService.generateNovelGame({
      genre,
      characters,
      setting,
      mood,
      customInput,
      storyLength
    });
    
    res.json({
      success: true,
      game: novelGame,
      shareUrl: `${req.protocol}://${req.get('host')}/novel/${novelGame.id}`
    });
  } catch (error) {
    console.error('Novel game generation error:', error);
    res.status(500).json({
      success: false,
      error: 'ノベルゲーム生成に失敗しました'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await novelService.getNovelGame(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'ゲームが見つかりません' });
    }
    res.json(game);
  } catch (error) {
    console.error('Novel game retrieval error:', error);
    res.status(500).json({ error: 'ゲームの取得に失敗しました' });
  }
});

module.exports = router;