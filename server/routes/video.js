const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Check if FFmpeg is available
let ffmpegAvailable = false;
try {
  const ffmpeg = require('fluent-ffmpeg');
  const { execSync } = require('child_process');
  execSync('ffmpeg -version', { stdio: 'ignore' });
  ffmpegAvailable = true;
  console.log('FFmpeg is available and ready for video generation');
} catch (error) {
  console.warn('FFmpeg not available. Video generation will be disabled.');
  console.warn('Error:', error.message);
}

// Configure multer for handling frame data
const upload = multer({ 
  dest: 'temp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

router.post('/generate', upload.single('frameData'), async (req, res) => {
  try {
    if (!ffmpegAvailable) {
      return res.status(503).json({ 
        error: 'FFmpegが利用できません。サーバーにFFmpegをインストールしてください。',
        instructions: 'Ubuntu/Debian: sudo apt install ffmpeg\nCentOS/RHEL: sudo yum install ffmpeg\nWindows: https://ffmpeg.org/download.html'
      });
    }

    const { frames, duration, frameRate } = JSON.parse(req.body.metadata);
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'フレームデータが不正です' });
    }

    const tempFrameDir = path.join(tempDir, `frames_${Date.now()}`);
    fs.mkdirSync(tempFrameDir, { recursive: true });

    // Save frames as individual PNG files
    const framePromises = frames.map(async (frameData, index) => {
      const frameNumber = String(index + 1).padStart(4, '0');
      const framePath = path.join(tempFrameDir, `frame_${frameNumber}.png`);
      
      // Remove data URL prefix if present
      const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
      
      return new Promise((resolve, reject) => {
        fs.writeFile(framePath, base64Data, 'base64', (err) => {
          if (err) reject(err);
          else resolve(framePath);
        });
      });
    });

    await Promise.all(framePromises);

    // Generate MP4 using FFmpeg
    const ffmpeg = require('fluent-ffmpeg');
    const outputPath = path.join(tempDir, `video_${Date.now()}.mp4`);
    const inputPattern = path.join(tempFrameDir, 'frame_%04d.png');

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPattern)
        .inputOptions([
          '-framerate', frameRate || '10',
          '-t', duration || '45'
        ])
        .videoCodec('libx264')
        .outputOptions([
          '-pix_fmt', 'yuv420p',
          '-crf', '23',
          '-preset', 'medium',
          '-movflags', '+faststart'
        ])
        .output(outputPath)
        .on('end', () => {
          console.log('Video generation completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Send the video file
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="novel_video.mp4"');
    
    const videoStream = fs.createReadStream(outputPath);
    videoStream.pipe(res);

    // Cleanup after sending
    videoStream.on('end', () => {
      // Clean up temporary files
      setTimeout(() => {
        try {
          fs.rmSync(tempFrameDir, { recursive: true, force: true });
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }, 5000); // 5 second delay to ensure download completes
    });

  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ 
      error: '動画生成に失敗しました',
      details: error.message 
    });
  }
});

module.exports = router;