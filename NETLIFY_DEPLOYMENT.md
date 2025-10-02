# 🚀 Netlify Deployment Guide

## Overview

Your AI Story Voice Generator is now configured for Netlify deployment with serverless functions.

## What Was Configured

### 1. Netlify Configuration (`netlify.toml`)
- Build settings
- Serverless functions directory
- Redirect rules for API endpoints
- Environment variables

### 2. Serverless Functions
- `netlify/functions/generate-story.js` - Story generation endpoint
- `netlify/functions/generate-audio.js` - Voice generation endpoint

### 3. API Routes
- `/api/generate-story` → `/.netlify/functions/generate-story`
- `/api/generate-audio` → `/.netlify/functions/generate-audio`

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Go to Netlify**
   - Visit https://app.netlify.com/
   - Sign in or create an account

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify to access your repositories
   - Select `aflorentin001/eleven`

3. **Configure Build Settings**
   - **Build command**: `npm install` (auto-detected)
   - **Publish directory**: `public` (auto-detected)
   - **Functions directory**: `netlify/functions` (auto-detected)

4. **Add Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add the following variables:
     ```
     OPENAI_API_KEY = your_openai_api_key_here
     ELEVENLABS_API_KEY = your_elevenlabs_api_key_here
     ```
   - ⚠️ **IMPORTANT**: Use your actual API keys, not the placeholder values

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (~2-3 minutes)
   - Your site will be live at: `https://[random-name].netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain or use Netlify's subdomain

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set OPENAI_API_KEY "your_openai_api_key_here"
netlify env:set ELEVENLABS_API_KEY "your_elevenlabs_api_key_here"

# Deploy
netlify deploy --prod
```

## Environment Variables Setup

### Required Variables:
1. **OPENAI_API_KEY**
   - Get from: https://platform.openai.com/api-keys
   - Format: `sk-proj-...`

2. **ELEVENLABS_API_KEY**
   - Get from: https://elevenlabs.io/ (Profile → API Keys)
   - Format: Your ElevenLabs API key

### How to Add in Netlify:
1. Go to your site dashboard
2. Click "Site settings"
3. Click "Environment variables" in the left sidebar
4. Click "Add a variable"
5. Add each key-value pair
6. Click "Save"
7. Redeploy your site for changes to take effect

## Testing Your Deployment

After deployment:

1. **Visit your site URL**
   - Example: `https://your-site-name.netlify.app`

2. **Test Story Generation**
   - Enter a story idea
   - Click "Generate Story"
   - Verify the story appears

3. **Test Voice Generation**
   - Click "Generate Voice"
   - Verify audio plays correctly

4. **Test All Features**
   - Playback speed control
   - Rating system
   - Share functionality
   - Story library

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version is compatible (v18+)

### API Errors (401/403)
- Verify environment variables are set correctly
- Check API keys are valid and active
- Ensure no extra spaces in environment variables

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify function names match API routes
- Ensure CORS headers are properly set

### Audio Not Playing
- Check browser console for errors
- Verify ElevenLabs API key is valid
- Check if you've exceeded API quota

## Monitoring

### Netlify Dashboard
- **Analytics**: View site traffic and performance
- **Functions**: Monitor serverless function usage
- **Logs**: Check function execution logs
- **Deploy logs**: Review build and deploy history

### Usage Limits
- **Netlify Free Tier**:
  - 100GB bandwidth/month
  - 125k function requests/month
  - 100 build minutes/month

- **API Limits**:
  - OpenAI: Based on your plan
  - ElevenLabs: Based on your plan

## Continuous Deployment

Your site is now set up for continuous deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Automatic Deploy**
   - Netlify automatically detects the push
   - Builds and deploys your changes
   - Updates your live site

## Custom Domain Setup

1. **In Netlify Dashboard**:
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain name

2. **Update DNS**:
   - Add Netlify's DNS records to your domain provider
   - Wait for DNS propagation (up to 48 hours)

3. **Enable HTTPS**:
   - Netlify automatically provisions SSL certificate
   - Your site will be accessible via HTTPS

## Performance Optimization

### Already Configured:
- ✅ Static file serving from `public/`
- ✅ Serverless functions for API calls
- ✅ Automatic CDN distribution
- ✅ HTTPS enabled

### Recommendations:
- Monitor function execution times
- Optimize images if needed
- Consider caching strategies for frequently accessed data

## Security Checklist

- ✅ API keys stored as environment variables
- ✅ No secrets in code
- ✅ CORS properly configured
- ✅ HTTPS enabled by default
- ✅ Environment variables encrypted by Netlify

## Support

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Community**: https://answers.netlify.com/
- **Your Repository**: https://github.com/aflorentin001/eleven

## Next Steps

1. ✅ Push Netlify configuration to GitHub
2. ✅ Deploy to Netlify
3. ✅ Add environment variables
4. ✅ Test all features
5. ✅ Share your live site!

---

**Your site will be live at**: `https://[your-site-name].netlify.app`

Good luck with your deployment! 🚀✨
