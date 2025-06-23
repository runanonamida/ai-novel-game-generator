# FFmpeg Setup Guide

The video generation feature requires FFmpeg to be installed on your server.

## Installation Instructions

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### CentOS/RHEL/Amazon Linux
```bash
sudo yum install epel-release
sudo yum install ffmpeg
```

### macOS (with Homebrew)
```bash
brew install ffmpeg
```

### Windows
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to a folder (e.g., C:\ffmpeg)
3. Add C:\ffmpeg\bin to your system PATH

### Verification
After installation, verify FFmpeg is working:
```bash
ffmpeg -version
```

## Railway Deployment
If deploying on Railway, add this to your railway.json:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "apt-get update && apt-get install -y ffmpeg && npm install && cd client && npm install && npm run build"
  }
}
```

## Alternative: Docker
You can also use a Docker container with FFmpeg pre-installed:
```dockerfile
FROM node:18-bullseye
RUN apt-get update && apt-get install -y ffmpeg
COPY . .
RUN npm install
WORKDIR client
RUN npm install && npm run build
WORKDIR ..
EXPOSE 5000
CMD ["npm", "start"]
```

## Features Available Without FFmpeg
- Promotional image generation (static PNG)
- Game generation and playing
- All other app features

## Features Requiring FFmpeg
- MP4 video generation
- Animated video output for social media