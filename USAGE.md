# Quick Start Guide

## ✅ Server Status
Your server is **RUNNING** on http://localhost:3000

## 🚀 How to Access

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the "AI Story Voice Generator" interface

## 📝 How to Use

### Step 1: Generate a Story
- Enter a story idea in the text box (e.g., "A robot learning to feel emotions")
- Click **"Generate Story"**
- Wait a few seconds while OpenAI creates your story
- The story will appear below

### Step 2: Generate Voice
- After the story appears, click **"🎵 Generate Voice"**
- Wait while ElevenLabs converts the text to speech
- Audio player controls will appear

### Step 3: Listen
- Click **"▶️ Play"** to start the narration
- Click **"⏹️ Stop"** to stop and reset playback
- The status indicator shows the current playback state

## 🔧 Server Commands

**Start the server:**
```bash
npm start
```

**Stop the server:**
Press `Ctrl + C` in the terminal

**Restart the server:**
Stop it first, then run `npm start` again

## 🔑 API Keys
Your API keys are securely stored in `.env`:
- ✅ ELEVENLABS_API_KEY
- ✅ OPENAI_API_KEY

**Never share or commit this file to version control!**

## 🎨 Features
- Beautiful gradient UI
- Real-time loading indicators
- Error handling with user-friendly messages
- Responsive design (works on mobile too!)
- Audio controls with status updates

## 🐛 Troubleshooting

**Server won't start?**
- Make sure port 3000 is not already in use
- Check that all dependencies are installed: `npm install`

**Story generation fails?**
- Verify your OpenAI API key is valid
- Check your OpenAI account has credits

**Voice generation fails?**
- Verify your ElevenLabs API key is valid
- Check your ElevenLabs account has character quota

**Can't access http://localhost:3000?**
- Make sure the server is running (check terminal)
- Try refreshing the page
- Check browser console for errors (F12)

## 📊 Project Structure
```
Eleven/
├── .env                 # API keys (DO NOT COMMIT)
├── .gitignore          # Protects sensitive files
├── package.json        # Dependencies
├── server.js           # Backend API server
├── README.md           # Full documentation
├── USAGE.md            # This file
└── public/
    ├── index.html      # Main interface
    ├── styles.css      # Styling
    └── script.js       # Frontend logic
```

Enjoy creating AI-powered stories! 🎉
