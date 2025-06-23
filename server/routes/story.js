const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

router.post('/generate', async (req, res) => {
  try {
    const { genre, keywords, characters, mood, customInput } = req.body;
    
    const story = await geminiService.generateStory({
      genre,
      keywords,
      characters,
      mood,
      customInput
    });
    
    res.json({
      success: true,
      story,
      shareUrl: `${req.protocol}://${req.get('host')}/story/${story.id}`
    });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      success: false,
      error: 'ストーリー生成に失敗しました'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const story = await geminiService.getStory(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'ストーリーが見つかりません' });
    }
    res.json(story);
  } catch (error) {
    console.error('Story retrieval error:', error);
    res.status(500).json({ error: 'ストーリーの取得に失敗しました' });
  }
});

module.exports = router;