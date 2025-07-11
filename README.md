
# Bintubot - YouTube Live Streaming App

A lightweight web application for streaming videos to YouTube Live. Perfect for VPS deployment or running directly on Android devices using Termux or UserLAnd.

## 🚀 Quick Start

### Option 1: VPS/Server Deployment

1. **Upload files to your server:**
```bash
scp -r . user@your-server:/path/to/bintubot/
```

2. **Install dependencies:**
```bash
cd bintubot
npm install
```

3. **Install FFmpeg:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg
```

4. **Start the application:**
```bash
npm run dev
```

5. **Access the app:**
Open your browser and go to `http://localhost:5173`

### Option 2: Android with Termux

#### Step 1: Install Termux
- Download Termux from **F-Droid** (not Google Play Store)
- Install and open Termux

#### Step 2: Update Termux packages
```bash
pkg update && pkg upgrade
```

#### Step 3: Install required packages
```bash
pkg install nodejs npm git ffmpeg
```

#### Step 4: Optional - Setup storage access
```bash
termux-setup-storage
```
This allows Termux to access your phone's storage for video files.

#### Step 5: Clone or download Bintubot
```bash
# If using git
git clone <your-repo-url>
cd bintubot

# If you downloaded files manually, navigate to the folder
cd /sdcard/Download/bintubot  # or wherever you placed the files
```

#### Step 6: Install dependencies
```bash
npm install
```

#### Step 7: Start the application
```bash
npm run dev
```

#### Step 8: Access the app
- Open your phone's browser
- Go to `http://localhost:5173`
- Or access from other devices on the same network: `http://YOUR_PHONE_IP:5173`

### Option 3: Android with UserLAnd

#### Step 1: Install UserLAnd
- Download UserLAnd from Google Play Store
- Install and open UserLAnd

#### Step 2: Create Ubuntu environment
- Tap "Ubuntu" in UserLAnd
- Create a username and password
- Wait for the Ubuntu environment to install

#### Step 3: Update system packages
```bash
sudo apt update && sudo apt upgrade
```

#### Step 4: Install Node.js and FFmpeg
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
sudo apt install ffmpeg

# Install git (if needed)
sudo apt install git
```

#### Step 5: Get Bintubot files
```bash
# Clone from git
git clone <your-repo-url>
cd bintubot

# Or if you have files on your phone
cp -r /sdcard/Download/bintubot ./
cd bintubot
```

#### Step 6: Install dependencies
```bash
npm install
```

#### Step 7: Start the application
```bash
npm run dev
```

#### Step 8: Access the app
- Open your phone's browser
- Go to `http://localhost:5173`
- Or access from other devices: `http://YOUR_PHONE_IP:5173`

## 📺 How to Use Bintubot

### Step 1: Get YouTube Stream Key
1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Go Live" in the top right
3. Select "Stream" option
4. Copy your "Stream key"

### Step 2: Prepare Your Video
- Have your video file ready (MP4, AVI, MOV, etc.)
- Supported formats: Most common video formats

### Step 3: Start Streaming
1. Open Bintubot in your browser
2. Paste your YouTube Stream Key
3. Upload your video file
4. Check "Loop Video" if you want it to repeat
5. Click "Start Live Stream"

### Step 4: Monitor Stream
- Your stream will appear on your YouTube channel
- Check YouTube Studio for viewer count and chat
- Use the "Stop Stream" button when done

## 🔧 Production Deployment

For production use, consider using PM2:

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "bintubot" -- run dev

# Save PM2 config
pm2 save

# Setup auto-restart on boot
pm2 startup
```

## 🌐 Network Access

To access from other devices on your network:

1. **Find your IP address:**
```bash
# On Termux/UserLAnd
ip addr show | grep inet

# Or use this simple command
hostname -I
```

2. **Access from other devices:**
`http://YOUR_IP_ADDRESS:5173`

## 🔥 Firewall Setup (VPS only)

```bash
# Allow port 5173
sudo ufw allow 5173

# For production (port 80/443)
sudo ufw allow 80
sudo ufw allow 443
```

## 📱 Mobile Tips

### For Termux:
- Keep Termux running in the background
- Use "Acquire Wakelock" in Termux settings to prevent sleep
- Consider using a phone stand for better streaming setup

### For UserLAnd:
- UserLAnd provides a more stable Linux environment
- Better for longer streaming sessions
- Easier to manage multiple applications

## 🔍 Troubleshooting

### Common Issues:

**"FFmpeg not found"**
- Make sure FFmpeg is installed: `ffmpeg -version`
- Reinstall if needed: `pkg install ffmpeg` (Termux) or `sudo apt install ffmpeg` (UserLAnd)

**"Port already in use"**
- Change the port in vite.config.ts or kill the existing process
- Check running processes: `ps aux | grep node`

**"Cannot upload video"**
- Check available storage space
- Ensure video file is in a supported format
- Try a smaller video file first

**"Stream won't start"**
- Verify your YouTube stream key is correct
- Check your internet connection
- Make sure your YouTube channel is eligible for live streaming

**"Can't access from other devices"**
- Ensure your phone/device is connected to the same WiFi network
- Check if firewall is blocking the port
- Use your device's actual IP address, not localhost

### Getting Help:
- Check the console logs in your browser (F12 → Console)
- Look at the terminal output where you started the app
- Ensure all dependencies are properly installed

## 🎯 System Requirements

- **Node.js**: Version 16 or higher
- **FFmpeg**: Latest version
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 1GB free space minimum
- **Network**: Stable internet connection for streaming

## 📄 License

MIT License - Feel free to use and modify as needed.
