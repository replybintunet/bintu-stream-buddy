
#!/bin/bash

# Bintubot Startup Script
echo "🤖 Starting Bintubot..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed. Please install FFmpeg first."
    echo "Ubuntu/Debian: sudo apt install ffmpeg"
    echo "Termux: pkg install ffmpeg"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create uploads directory
mkdir -p uploads

# Set default port if not specified
export PORT=${PORT:-3001}

echo "🚀 Starting Bintubot server on port $PORT..."
echo "📺 Open your browser and go to: http://localhost:$PORT"
echo "🛑 Press Ctrl+C to stop the server"

# Start the server
node server.js
