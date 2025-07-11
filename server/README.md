
# Bintubot Server

A lightweight Node.js server for streaming videos to YouTube Live.

## Requirements

- Node.js (v14 or higher)
- FFmpeg installed on your system
- YouTube stream key

## Installation

1. Install Node.js dependencies:
```bash
npm install
```

2. Install FFmpeg:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**CentOS/RHEL:**
```bash
sudo yum install ffmpeg
```

**Android (Termux):**
```bash
pkg install nodejs ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html

## Running the Server

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on port 3001 by default.

## Environment Variables

- `PORT`: Server port (default: 3001)

## API Endpoints

- `POST /api/start-stream` - Start streaming a video
- `POST /api/stop-stream` - Stop current stream
- `GET /api/status` - Get streaming status
- `GET /api/health` - Health check

## Features

- Video file upload and streaming
- Loop video option
- YouTube Live integration
- Mobile-friendly interface
- Automatic cleanup of uploaded files
- Graceful shutdown handling

## Supported Video Formats

- MP4
- AVI
- MOV
- MKV
- WebM
- And most other common video formats supported by FFmpeg

## VPS Deployment

1. Copy the server files to your VPS
2. Install dependencies: `npm install`
3. Install FFmpeg on your VPS
4. Run with PM2 for production:
```bash
npm install -g pm2
pm2 start server.js --name bintubot
pm2 save
pm2 startup
```

## Termux (Android) Setup

1. Install Termux from F-Droid
2. Update packages: `pkg update && pkg upgrade`
3. Install Node.js and FFmpeg: `pkg install nodejs ffmpeg git`
4. Clone/copy your project files
5. Run: `npm install && npm start`

## Security Notes

- Stream keys are handled securely
- File uploads are limited to 500MB
- Only video files are accepted
- Uploaded files are automatically cleaned up after streaming

## Troubleshooting

1. **FFmpeg not found**: Make sure FFmpeg is installed and in your PATH
2. **Port already in use**: Change the PORT environment variable
3. **Large file uploads**: Adjust the file size limit in server.js
4. **Streaming quality**: Modify FFmpeg parameters in server.js for your needs
