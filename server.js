require('dotenv').config();
const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate story endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Story idea is required' });
    }

    console.log('Generating story for idea:', idea);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative storyteller. Write engaging short stories (200-300 words) based on the user\'s idea.'
        },
        {
          role: 'user',
          content: `Write a short story based on this idea: ${idea}`
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    const story = completion.choices[0].message.content;
    console.log('Story generated successfully');

    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error.message);
    res.status(500).json({ error: 'Failed to generate story: ' + error.message });
  }
});

// Generate audio endpoint
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if API key is loaded
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'ElevenLabs API key is not configured' });
    }

    console.log('Generating audio with ElevenLabs...');
    console.log('API Key present:', process.env.ELEVENLABS_API_KEY ? 'Yes (length: ' + process.env.ELEVENLABS_API_KEY.length + ')' : 'No');

    // First, get available voices to use a valid voice ID
    const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam voice - widely available

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('Audio generated successfully');

    // Convert to base64 for easy transmission
    const audioBase64 = Buffer.from(response.data).toString('base64');
    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error('Error generating audio:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    // Parse ElevenLabs error message
    let errorMessage = error.message;
    if (error.response?.data) {
      try {
        const errorData = typeof error.response.data === 'string' 
          ? JSON.parse(error.response.data) 
          : error.response.data;
        
        if (errorData.detail?.status === 'quota_exceeded') {
          errorMessage = 'ElevenLabs quota exceeded. Please upgrade your plan or wait until next month for quota reset.';
        } else if (errorData.detail?.message) {
          errorMessage = errorData.detail.message;
        }
      } catch (e) {
        // Keep original error message
      }
    }
    
    res.status(500).json({ error: 'Failed to generate audio: ' + errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
