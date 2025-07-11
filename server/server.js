
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `video_${timestamp}_${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Global variable to track streaming process
let streamingProcess = null;
let currentStreamKey = null;

// API Routes
app.post('/api/start-stream', upload.single('video'), (req, res) => {
  try {
    const { streamKey, loop } = req.body;
    const videoFile = req.file;

    if (!streamKey || !videoFile) {
      return res.status(400).json({ 
        error: 'Missing stream key or video file' 
      });
    }

    // Stop existing stream if running
    if (streamingProcess) {
      streamingProcess.kill('SIGTERM');
      streamingProcess = null;
    }

    const videoPath = videoFile.path;
    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
    
    // FFmpeg command for streaming
    const ffmpegArgs = [
      '-re', // Read input at native frame rate
      '-stream_loop', loop === 'true' ? '-1' : '0', // Loop if requested
      '-i', videoPath, // Input video file
      '-c:v', 'libx264', // Video codec
      '-preset', 'fast', // Encoding preset
      '-maxrate', '3000k', // Max bitrate
      '-bufsize', '6000k', // Buffer size
      '-pix_fmt', 'yuv420p', // Pixel format
      '-g', '50', // GOP size
      '-c:a', 'aac', // Audio codec
      '-b:a', '160k', // Audio bitrate
      '-ac', '2', // Audio channels
      '-ar', '44100', // Audio sample rate
      '-f', 'flv', // Output format
      rtmpUrl // Output URL
    ];

    console.log('Starting FFmpeg with args:', ffmpegArgs);

    // Spawn FFmpeg process
    streamingProcess = spawn('ffmpeg', ffmpegArgs);
    currentStreamKey = streamKey;

    streamingProcess.stdout.on('data', (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    streamingProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    streamingProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      streamingProcess = null;
      currentStreamKey = null;
      
      // Clean up uploaded file
      fs.unlink(videoPath, (err) => {
        if (err) console.log('Error deleting uploaded file:', err);
      });
    });

    streamingProcess.on('error', (error) => {
      console.error('FFmpeg process error:', error);
      res.status(500).json({ error: 'Failed to start streaming process' });
      return;
    });

    res.json({ 
      message: 'Stream started successfully',
      streamKey: streamKey.substring(0, 8) + '...' // Hide full key in response
    });

  } catch (error) {
    console.error('Error starting stream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/stop-stream', (req, res) => {
  try {
    if (streamingProcess) {
      streamingProcess.kill('SIGTERM');
      streamingProcess = null;
      currentStreamKey = null;
      res.json({ message: 'Stream stopped successfully' });
    } else {
      res.json({ message: 'No active stream to stop' });
    }
  } catch (error) {
    console.error('Error stopping stream:', error);
    res.status(500).json({ error: 'Failed to stop stream' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    isStreaming: !!streamingProcess,
    hasStreamKey: !!currentStreamKey
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve the React app (when built)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 500MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (streamingProcess) {
    streamingProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  if (streamingProcess) {
    streamingProcess.kill('SIGTERM');
  }
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Bintubot server running on port ${PORT}`);
  console.log(`📺 Ready to stream to YouTube Live!`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});
