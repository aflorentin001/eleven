# ⚡ Netlify Quick Start

## 🚀 Deploy in 5 Minutes

### Step 1: Go to Netlify
Visit: https://app.netlify.com/

### Step 2: Import from GitHub
1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub"
3. Select repository: `aflorentin001/eleven`

### Step 3: Add Environment Variables
**Site settings → Environment variables → Add variables**

```
OPENAI_API_KEY = your_openai_api_key_here
ELEVENLABS_API_KEY = your_elevenlabs_api_key_here
```

⚠️ **Use your actual API keys!**

### Step 4: Deploy
Click "Deploy site" and wait ~2-3 minutes

### Step 5: Test
Visit your live site: `https://[your-site-name].netlify.app`

---

## 📋 Checklist

- [ ] Netlify account created
- [ ] Repository imported
- [ ] Environment variables added:
  - [ ] OPENAI_API_KEY
  - [ ] ELEVENLABS_API_KEY
- [ ] Site deployed successfully
- [ ] Story generation tested
- [ ] Voice generation tested
- [ ] All features working

---

## 🔗 Your URLs

- **GitHub**: https://github.com/aflorentin001/eleven
- **Netlify**: https://app.netlify.com/
- **Live Site**: `https://[your-site-name].netlify.app`

---

## ⚠️ Common Issues

**Build fails?**
- Check environment variables are set
- Verify API keys are valid

**Functions not working?**
- Redeploy after adding environment variables
- Check function logs in Netlify dashboard

**Need help?**
- See `NETLIFY_DEPLOYMENT.md` for detailed guide
- Check Netlify docs: https://docs.netlify.com/

---

## ✨ That's it!

Your AI Story Voice Generator is now live on Netlify! 🎉
