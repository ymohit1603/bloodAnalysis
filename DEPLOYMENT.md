# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

### 1. Get Your API Key
First, get a free Groq API key:
- Visit: https://console.groq.com/
- Sign up with your email
- Create a new API key
- Copy the key (starts with `gsk_`)

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variable when prompted
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Alternative: Deploy via GitHub
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variable in Vercel dashboard:
   - `GROQ_API_KEY` = your Groq key

## Other Deployment Options

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=.next

# Set environment variables in Netlify dashboard
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Environment Variables

Set these in your deployment platform:

```bash
# Required for demo mode
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional: OpenAI fallback
OPENAI_API_KEY=sk_your_openai_key_here
```

## Testing Deployment

After deployment:
1. Visit your deployed URL
2. Try uploading a sample blood test
3. Test both with and without user API keys
4. Verify export functionality works
5. Check mobile responsiveness

## Production Considerations

### Rate Limiting
- Groq free tier: 6,000 requests/minute
- Consider implementing client-side rate limiting
- Add usage tracking for monitoring

### Performance
- Enable Vercel Analytics
- Monitor OCR processing times
- Consider adding image compression

### Security
- API keys are stored client-side only
- No server-side data persistence
- All processing is stateless

## Monitoring

Add these to track usage:
```javascript
// In your components
console.log('Analysis requested:', new Date().toISOString())
```

## Support

If you encounter deployment issues:
1. Check environment variables are set
2. Verify API keys are valid
3. Review build logs for errors
4. Test locally first with `npm run dev`
