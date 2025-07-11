
# Bintubot Deployment Guide

## Quick Start (VPS/Server)

1. **Upload files to your server:**
```bash
# Copy the server folder to your VPS
scp -r server/ user@your-server:/path/to/bintubot/
```

2. **Install dependencies:**
```bash
cd server
npm install
```

3. **Install FFmpeg:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg

# Or compile from source if not available in repos
```

4. **Make start script executable:**
```bash
chmod +x start.sh
```

5. **Run the server:**
```bash
./start.sh
# Or directly: node server.js
```

## Termux (Android) Deployment

1. **Install Termux** from F-Droid (not Google Play)

2. **Setup environment:**
```bash
# Update packages
pkg update && pkg upgrade

# Install required packages
pkg install nodejs npm ffmpeg git

# Give storage permission (optional)
termux-setup-storage
```

3. **Deploy Bintubot:**
```bash
# Copy server files to Termux
# You can use git, adb, or file manager

cd server
npm install
chmod +x start.sh
./start.sh
```

4. **Access the app:**
- Local: http://localhost:3001
- Network: http://YOUR_PHONE_IP:3001

## Production Deployment (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name bintubot

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit
```

## Environment Variables

```bash
# Set custom port
export PORT=8080

# Or create .env file
echo "PORT=8080" > .env
```

## Nginx Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Firewall Setup

```bash
# Allow port 3001 (or your custom port)
sudo ufw allow 3001

# For production with Nginx
sudo ufw allow 80
sudo ufw allow 443
```

## Getting YouTube Stream Key

1. Go to YouTube Studio
2. Click "Go Live"
3. Select "Stream"
4. Copy your "Stream key"
5. Paste it into Bintubot

## Troubleshooting

- **Port in use**: Change PORT environment variable
- **FFmpeg not found**: Install FFmpeg and ensure it's in PATH
- **Permission denied**: Check file permissions and user access
- **Upload fails**: Check disk space and file size limits
- **Stream doesn't start**: Verify YouTube stream key and internet connection
