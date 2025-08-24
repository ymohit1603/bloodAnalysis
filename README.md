# 🩸 Blood Analysis Tool

An AI-powered blood test analysis tool with OCR capabilities. Upload your blood test results (PDF or images) and get instant AI insights with dietary and lifestyle recommendations.

## ✨ Features

- **📄 Multi-format Support**: Upload PDF documents or images (PNG, JPG, JPEG)
- **🔍 Smart OCR**: Automatic text extraction using Tesseract.js for images and PDF.js for documents
- **🤖 AI Analysis**: Powered by AI models (OpenAI GPT or free Groq alternatives)
- **🎯 Structured Results**: Color-coded markers, health insights, and recommendations
- **🔒 Privacy-First**: No server-side storage, optional user API keys stored locally
- **📊 Export Options**: Download results as images using html2canvas
- **⚡ Serverless**: Runs on Vercel/Netlify edge functions
- **🚫 No Authentication**: Completely stateless operation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bloodanalysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo 'GROQ_API_KEY=your_groq_api_key_here' > .env.local
   ```

4. **Get a free API key** (for unlimited usage without user keys)
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up and get your free API key
   - Add it to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Start uploading blood test results!

## 🔧 Configuration

### API Keys

The app supports two modes:

1. **User-provided API Keys** (Recommended for personal use)
   - Users can enter their OpenAI API key in the UI
   - Stored locally in browser localStorage
   - Provides unlimited usage with OpenAI GPT-3.5

2. **Free Demo Mode** (Default fallback)
   - Uses Groq's free API with Llama 3 model
   - Limited usage but no user setup required
   - Perfect for demos and light usage

### Environment Variables

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here        # For free demo mode
OPENAI_API_KEY=your_openai_key_here        # Optional backup
```

## 📱 How to Use

1. **Upload**: Drag & drop or select your blood test file (PDF/image)
2. **Process**: OCR automatically extracts text and identifies markers
3. **Configure** (Optional): Add your API key for unlimited usage
4. **Analyze**: Click "Analyze Blood Test Results" 
5. **Review**: View color-coded results, insights, and recommendations
6. **Export**: Download results as an image for sharing

## 🏗️ Architecture

```
bloodanalysis/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/analyze/        # Serverless analysis endpoint
│   │   ├── globals.css         # Tailwind styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main application page
│   ├── components/             # React components
│   │   ├── FileUpload.tsx      # File upload & OCR processing
│   │   ├── ApiKeyInput.tsx     # API key management
│   │   ├── AnalysisResults.tsx # Results display & export
│   │   └── MedicalDisclaimer.tsx # Safety warnings
│   ├── lib/                    # Utilities
│   │   ├── ocr.ts              # OCR processing logic
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript definitions
│       └── blood-analysis.ts   # Data structures
├── package.json
└── README.md
```

## 🔒 Privacy & Security

- **No Data Storage**: Everything runs client-side or in stateless edge functions
- **Local API Keys**: User API keys stored in browser localStorage only
- **No Tracking**: No analytics or user tracking
- **Medical Disclaimers**: Clear warnings about AI limitations
- **Open Source**: Fully transparent implementation

## ⚕️ Medical Disclaimer

**⚠️ IMPORTANT: This tool is for educational purposes only.**

- AI analysis may contain errors or inaccuracies
- Always consult qualified healthcare professionals
- Do not make medical decisions based solely on this analysis
- In emergencies or with critical values, seek immediate medical attention

## 🛠️ Development

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **OCR**: Tesseract.js (images), PDF.js (PDFs)
- **Validation**: Zod schemas
- **Export**: html2canvas
- **Icons**: Lucide React
- **AI APIs**: OpenAI GPT-3.5, Groq Llama 3

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Production server
npm run lint         # ESLint check
```

### Adding New Features

1. **New Blood Markers**: Update parsing logic in `src/lib/ocr.ts`
2. **UI Components**: Add to `src/components/` with TypeScript
3. **Analysis Logic**: Modify prompts in `src/app/api/analyze/route.ts`
4. **Styling**: Use Tailwind classes with shadcn/ui patterns

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
GROQ_API_KEY=your_key_here
```

### Netlify

```bash
# Install Netlify CLI  
npm i -g netlify-cli

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

## 📈 Scaling for Production

For handling 50-100 users:

1. **Free Tier Strategy**:
   - Use Groq API (free tier: 6,000 requests/minute)
   - Deploy on Vercel (free: 100GB bandwidth)
   - No database costs (stateless design)

2. **Rate Limiting**:
   - Implement client-side delays
   - Add usage tracking in localStorage
   - Consider server-side rate limiting for production

3. **Performance**:
   - OCR runs client-side (no server load)
   - Stateless design scales automatically
   - CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/bloodanalysis/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/bloodanalysis/discussions)
- **Email**: your-email@example.com

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT models
- [Groq](https://groq.com/) for free AI inference
- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing
- [Vercel](https://vercel.com/) for hosting platform

---

**⚠️ Remember: This tool provides educational information only. Always consult healthcare professionals for medical advice.**
