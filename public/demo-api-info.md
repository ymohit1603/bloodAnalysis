# API Setup Instructions

## For Free Usage (Demo Mode)

1. **Get Groq API Key** (Free):
   - Visit: https://console.groq.com/
   - Sign up with your email
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `gsk_`)

2. **Add to Environment**:
   ```bash
   # Create .env.local file
   GROQ_API_KEY=gsk_your_key_here
   ```

## For Unlimited Usage

Users can enter their own OpenAI API key in the app interface:
- Visit: https://platform.openai.com/api-keys
- Create new secret key
- Enter in the app's "API Configuration" section

## Models Used

- **Demo Mode**: Llama 3 via Groq (Free)
- **User Keys**: GPT-3.5-turbo via OpenAI (Paid per use)
