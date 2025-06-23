import React, { useState, useRef } from 'react';
import axios from 'axios';
import { NovelGame } from '../types';

interface Props {
  game: NovelGame;
  onClose: () => void;
}

const VideoGenerator: React.FC<Props> = ({ game, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState<'short' | 'medium' | 'full'>('full');
  const [outputFormat, setOutputFormat] = useState<'gif' | 'video'>('video');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateVideo = async () => {
    if (outputFormat === 'gif') {
      await generateGIF();
    } else {
      await generateWebMVideo(); // 確実に動作するWebM生成を使用
    }
  };

  const generateGIF = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      // 9:16のショート動画形式（GIF用に少し小さめ）
      canvas.width = 540;  // 720から540に縮小
      canvas.height = 960; // 1280から960に縮小

      // 簡略化したGIF生成：連続画像として出力
      setProgress(10);
      
      // 単一の代表フレームを作成（静止画として）
      await createSampleFrame(canvas, ctx);
      
      // Canvas内容をPNG画像として出力
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${game.title}_sample.png`;
          a.click();
          
          URL.revokeObjectURL(url);
          setProgress(100);
          alert('サンプル画像のダウンロードが開始されました！');
        }
        setIsGenerating(false);
      }, 'image/png');

    } catch (error) {
      console.error('Image generation error:', error);
      alert('画像生成に失敗しました');
      setIsGenerating(false);
    }
  };

  // サンプルフレーム作成
  const createSampleFrame = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // 背景画像の読み込みを試行
    let backgroundDrawn = false;
    if (game.scenes.length > 0 && game.scenes[0].background && !game.scenes[0].background.startsWith('data:')) {
      try {
        const backgroundImg = new Image();
        await new Promise((resolve) => {
          backgroundImg.onload = () => {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            backgroundDrawn = true;
            resolve(null);
          };
          backgroundImg.onerror = () => {
            console.log('Background failed to load for promo:', game.scenes[0].background);
            resolve(null);
          };
          backgroundImg.src = game.scenes[0].background!;
        });
      } catch (error) {
        console.log('Background loading error for promo:', error);
      }
    }

    // フォールバック背景
    if (!backgroundDrawn) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // キャラクター画像の読み込みを試行
    if (game.scenes.length > 0 && game.scenes[0].dialogues.length > 0) {
      const firstDialogue = game.scenes[0].dialogues[0];
      if (firstDialogue.character && firstDialogue.character.image) {
        try {
          const characterImg = new Image();
          await new Promise((resolve) => {
            characterImg.onload = () => {
              const charWidth = 240;
              const charHeight = (characterImg.naturalHeight / characterImg.naturalWidth) * charWidth;
              const charX = (canvas.width - charWidth) / 2;
              // プロモ画像でもキャラクターを下部に配置
              const charY = canvas.height - charHeight - 40;
              ctx.drawImage(characterImg, charX, charY, charWidth, charHeight);
              resolve(null);
            };
            characterImg.onerror = () => {
              console.log('Character image failed to load for promo:', firstDialogue.character!.image);
              resolve(null);
            };
            characterImg.src = firstDialogue.character!.image;
          });
        } catch (error) {
          console.log('Character loading error for promo:', error);
        }
      }
    }

    // ゲームタイトル
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(game.title, canvas.width / 2, 100);

    // 最初のダイアログを表示
    if (game.scenes.length > 0 && game.scenes[0].dialogues.length > 0) {
      const firstDialogue = game.scenes[0].dialogues[0];
      
      // テキストボックス
      const boxHeight = 200;
      const boxY = canvas.height - boxHeight;
      
      ctx.fillStyle = 'rgba(0, 0, 30, 0.9)';
      ctx.fillRect(20, boxY, canvas.width - 40, boxHeight - 20);
      ctx.strokeStyle = '#4a90e2';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, boxY, canvas.width - 40, boxHeight - 20);

      // キャラクター名
      if (firstDialogue.character) {
        ctx.fillStyle = '#4a90e2';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(firstDialogue.character.name, 40, boxY + 30);
      }

      // テキスト
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      const text = firstDialogue.text;
      const maxWidth = canvas.width - 80;
      
      let y = boxY + 60;
      const words = text.split('');
      let line = '';
      
      for (const char of words) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, 40, y);
          line = char;
          y += 22;
          if (y > boxY + boxHeight - 40) break; // 範囲外なら終了
        } else {
          line = testLine;
        }
      }
      if (line && y <= boxY + boxHeight - 40) {
        ctx.fillText(line, 40, y);
      }
    }

    // プロモーションテキスト
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AIが生成したビジュアルノベル', canvas.width / 2, canvas.height - 30);
  };


  const generateWebMVideo = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      // 9:16のショート動画形式
      canvas.width = 720;
      canvas.height = 1280;

      // MediaRecorderを使用してWebM形式で直接録画
      const stream = canvas.captureStream(30); // 30fps
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 2000000 // 2Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${game.title}_video.webm`;
        a.click();
        
        URL.revokeObjectURL(url);
        setProgress(100);
        
        // MP4変換の案内
        const convertToMp4 = window.confirm(
          'WebM動画のダウンロードが完了しました！\n\n' +
          'X/Twitterに投稿するにはMP4形式への変換が必要です。\n\n' +
          '「OK」を押すと無料のオンライン変換ツール（CloudConvert）を開きます。\n' +
          '「キャンセル」でそのまま終了します。'
        );
        
        if (convertToMp4) {
          window.open('https://cloudconvert.com/webm-to-mp4', '_blank');
        }
        
        setIsGenerating(false);
      };

      mediaRecorder.start();

      // 動画設定
      const durationSettings = {
        short: {
          maxScenes: 2,
          maxDialoguesPerScene: 4,
          typingSpeed: 30,
          finalFrameDelay: 800
        },
        medium: {
          maxScenes: 3,
          maxDialoguesPerScene: 6,
          typingSpeed: 50,
          finalFrameDelay: 1000
        },
        full: {
          maxScenes: game.scenes.length,
          maxDialoguesPerScene: Infinity,
          typingSpeed: 100,
          finalFrameDelay: 1000
        }
      };

      const settings = durationSettings[videoDuration];

      // 各シーンを順次描画
      let sceneIndex = 0;
      const totalScenes = Math.min(game.scenes.length, settings.maxScenes);

      const renderScene = async () => {
        if (sceneIndex >= totalScenes) {
          mediaRecorder.stop();
          return;
        }

        const scene = game.scenes[sceneIndex];
        setProgress((sceneIndex / totalScenes) * 100);

        const dialogues = scene.dialogues
          .filter(dialogue => dialogue.type !== 'choice')
          .slice(0, settings.maxDialoguesPerScene);

        for (const dialogue of dialogues) {
          // 背景画像の読み込みと描画
          let backgroundDrawn = false;
          let backgroundImg: HTMLImageElement | null = null;
          if (scene.background && !scene.background.startsWith('data:')) {
            try {
              backgroundImg = new Image();
              
              await new Promise((resolve) => {
                backgroundImg!.onload = () => {
                  ctx.drawImage(backgroundImg!, 0, 0, canvas.width, canvas.height);
                  backgroundDrawn = true;
                  resolve(null);
                };
                backgroundImg!.onerror = () => {
                  console.log('Background failed to load:', scene.background);
                  resolve(null);
                };
                backgroundImg!.src = scene.background!;
              });
            } catch (error) {
              console.log('Background loading error:', error);
            }
          }

          // フォールバック背景
          if (!backgroundDrawn) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // キャラクター画像の描画
          let characterImg: HTMLImageElement | null = null;
          if (dialogue.character && dialogue.character.image) {
            try {
              characterImg = new Image();
              
              await new Promise((resolve) => {
                characterImg!.onload = () => {
                  const charWidth = 300;
                  const charHeight = (characterImg!.naturalHeight / characterImg!.naturalWidth) * charWidth;
                  const charX = (canvas.width - charWidth) / 2;
                  // キャラクターを画面下部に配置（テキストボックスの上に少し余白）
                  const charY = canvas.height - charHeight - 50;
                  
                  ctx.drawImage(characterImg!, charX, charY, charWidth, charHeight);
                  resolve(null);
                };
                characterImg!.onerror = () => {
                  console.log('Character image failed to load:', dialogue.character!.image);
                  resolve(null);
                };
                characterImg!.src = dialogue.character!.image;
              });
            } catch (error) {
              console.log('Character loading error:', error);
            }
          }

          // テキストボックス
          const boxHeight = 200;
          const boxY = canvas.height - boxHeight;
          
          ctx.fillStyle = 'rgba(0, 0, 30, 0.9)';
          ctx.fillRect(0, boxY, canvas.width, boxHeight);
          ctx.strokeStyle = '#4a90e2';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, boxY, canvas.width, boxHeight);

          // キャラクター名
          if (dialogue.character) {
            ctx.fillStyle = '#4a90e2';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(dialogue.character.name, 30, boxY + 35);
          }

          // タイピング効果で文字を表示
          const text = dialogue.text;
          const charStep = videoDuration === 'short' ? 8 : videoDuration === 'medium' ? 5 : 3;
          
          // 最後のフレームで確実に全文を表示するため、少し多めにループ
          const maxIndex = text.length + charStep;
          for (let charIndex = 0; charIndex <= maxIndex; charIndex += charStep) {
            // 文字数を超えた場合は全文を表示
            const displayLength = Math.min(charIndex, text.length);
            
            // 背景再描画
            if (backgroundDrawn && backgroundImg && backgroundImg.complete) {
              ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            } else {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#667eea');
              gradient.addColorStop(1, '#764ba2');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // キャラクター再描画
            if (dialogue.character && characterImg && characterImg.complete) {
              const charWidth = 300;
              const charHeight = (characterImg.naturalHeight / characterImg.naturalWidth) * charWidth;
              const charX = (canvas.width - charWidth) / 2;
              // キャラクターを画面下部に配置（テキストボックスの上に少し余白）
              const charY = canvas.height - charHeight - 50;
              ctx.drawImage(characterImg, charX, charY, charWidth, charHeight);
            }

            // テキストボックス再描画
            ctx.fillStyle = 'rgba(0, 0, 30, 0.9)';
            ctx.fillRect(0, boxY, canvas.width, boxHeight);
            ctx.strokeStyle = '#4a90e2';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, boxY, canvas.width, boxHeight);

            if (dialogue.character) {
              ctx.fillStyle = '#4a90e2';
              ctx.font = 'bold 20px Arial';
              ctx.textAlign = 'left';
              ctx.fillText(dialogue.character.name, 30, boxY + 35);
            }

            // 段階的テキスト表示
            const displayText = text.substring(0, displayLength);
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            
            let currentY = boxY + 70;
            let currentLineText = '';
            const maxWidth = canvas.width - 60;
            
            for (const char of displayText) {
              const testLine = currentLineText + char;
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > maxWidth && currentLineText !== '') {
                ctx.fillText(currentLineText, 30, currentY);
                currentY += 25;
                currentLineText = char;
                if (currentY > boxY + boxHeight - 40) break;
              } else {
                currentLineText = testLine;
              }
            }
            if (currentLineText && currentY <= boxY + boxHeight - 40) {
              ctx.fillText(currentLineText, 30, currentY);
            }

            // フレーム間の待機（動画の長さに応じて調整）
            // 最後のフレーム（全文表示）では少し長めに待機
            const frameDelay = displayLength >= text.length ? settings.typingSpeed * 2 : settings.typingSpeed;
            await new Promise(resolve => setTimeout(resolve, frameDelay));
          }

          // テキストの長さに応じて表示時間を調整
          const baseDelay = settings.finalFrameDelay;
          const textMultiplier = videoDuration === 'short' ? 25 : 40; // ショートは25ms/文字
          const textBasedDelay = Math.max(baseDelay, text.length * textMultiplier);
          const totalTypingTime = (text.length / charStep) * settings.typingSpeed;
          
          // ショート動画用の短縮設定
          const minDelay = videoDuration === 'short' ? 800 : 1500;
          const additionalDelay = Math.max(minDelay, textBasedDelay - totalTypingTime);
          
          // 最後のダイアログかどうかを判定
          const isLastDialogue = sceneIndex === totalScenes - 1 && 
                                 dialogue === dialogues[dialogues.length - 1];
          
          // 最後のダイアログの場合の追加時間もショート用に調整
          const lastDialogueBonus = videoDuration === 'short' ? 1000 : 2000;
          const finalDelay = isLastDialogue ? additionalDelay + lastDialogueBonus : additionalDelay;
          
          await new Promise(resolve => setTimeout(resolve, finalDelay));
        }

        sceneIndex++;
        
        // 最後のシーンの場合は追加の待機時間
        if (sceneIndex >= totalScenes) {
          const endingDelay = videoDuration === 'short' ? 1500 : 3000;
          await new Promise(resolve => setTimeout(resolve, endingDelay));
        }
        
        renderScene();
      };

      renderScene();

    } catch (error: any) {
      console.error('Video generation error:', error);
      alert('動画生成に失敗しました：' + error.message);
      setIsGenerating(false);
    }
  };


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>ショート動画を作成</h2>
        
        {isGenerating ? (
          <div>
            <div style={{
              width: '100%',
              height: '10px',
              background: '#f0f0f0',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: '#4a90e2',
                borderRadius: '5px',
                transition: 'width 0.3s'
              }} />
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              動画を生成中... ({Math.round(progress)}%)
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              ゲームの内容を自動再生するアニメーションを作成します。<br/>
              X/Twitter、TikTok、YouTube Shortsでの投稿に最適です。
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                出力形式:
              </label>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                  onClick={() => setOutputFormat('gif')}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #4a90e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: outputFormat === 'gif' ? '#4a90e2' : 'white',
                    color: outputFormat === 'gif' ? 'white' : '#4a90e2',
                    fontWeight: 'bold'
                  }}
                >
                  プロモ画像 (推奨)
                </button>
                <button
                  onClick={() => setOutputFormat('video')}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #4a90e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: outputFormat === 'video' ? '#4a90e2' : 'white',
                    color: outputFormat === 'video' ? 'white' : '#4a90e2',
                    fontWeight: 'bold'
                  }}
                >
                  動画ファイル
                </button>
              </div>
              <small style={{ color: '#666', fontSize: '12px', display: 'block', textAlign: 'center' }}>
                {outputFormat === 'gif' 
                  ? '✓ プロモ画像はX/Twitterで確実にアップロード可能です' 
                  : '✓ WebM動画を生成し、MP4変換ツールへのリンクを提供します（X/Twitter対応）'
                }
              </small>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                長さ:
              </label>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setVideoDuration('short')}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #4a90e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: videoDuration === 'short' ? '#4a90e2' : 'white',
                    color: videoDuration === 'short' ? 'white' : '#4a90e2',
                    fontWeight: 'bold'
                  }}
                >
                  45秒 (ショート)
                </button>
                <button
                  onClick={() => setVideoDuration('medium')}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #4a90e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: videoDuration === 'medium' ? '#4a90e2' : 'white',
                    color: videoDuration === 'medium' ? 'white' : '#4a90e2',
                    fontWeight: 'bold'
                  }}
                >
                  1分 (ミディアム)
                </button>
                <button
                  onClick={() => setVideoDuration('full')}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #4a90e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: videoDuration === 'full' ? '#4a90e2' : 'white',
                    color: videoDuration === 'full' ? 'white' : '#4a90e2',
                    fontWeight: 'bold'
                  }}
                >
                  フル (全て)
                </button>
              </div>
            </div>
            
            <button
              onClick={generateVideo}
              className="generate-button"
              style={{ marginBottom: '15px' }}
            >
              {outputFormat === 'gif' ? 'プロモ画像' : '動画'}を生成する
            </button>
          </div>
        )}
        
        <button
          onClick={onClose}
          style={{
            background: '#ccc',
            color: '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          disabled={isGenerating}
        >
          閉じる
        </button>
        
        <canvas
          ref={canvasRef}
          width={720}
          height={1280}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default VideoGenerator;