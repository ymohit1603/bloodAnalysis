# 🩸 Getting Started Guide

## Prerequisites

- Node.js 18 or higher
- A free Groq API key (for unlimited demo usage)

## Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd bloodanalysis
npm install
```

### 2. Get API Key (Free)
1. Visit: https://console.groq.com/
2. Sign up with your email
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### 3. Configure Environment
Create `.env.local` file in the root directory:
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## How to Use

### 1. Upload Blood Test
- Drag & drop or click to select
- Supports: PDF, PNG, JPG, JPEG
- OCR automatically extracts text

### 2. Configure API (Optional)
- Click "Configure" in API section
- Enter your OpenAI API key for better results
- Or leave blank to use free demo mode

### 3. Analyze Results
- Click "Analyze Blood Test Results"
- Wait for AI processing (10-30 seconds)
- Review color-coded results

### 4. Export Results
- Click "Export" button in results
- Downloads as PNG image
- Includes all analysis data

## Sample Blood Test Files

Test the app with these common formats:

### Text Format Example
```
Complete Blood Count (CBC)
White Blood Cell Count: 7.2 K/uL (4.0-10.0)
Red Blood Cell Count: 4.5 M/uL (4.2-5.4)
Hemoglobin: 14.2 g/dL (12.0-16.0)
Hematocrit: 42.1% (37.0-47.0)
Platelet Count: 285 K/uL (150-400)

Basic Metabolic Panel
Glucose: 95 mg/dL (70-100)
Sodium: 138 mEq/L (135-145)
Potassium: 4.1 mEq/L (3.5-5.0)
Chloride: 102 mEq/L (98-107)
Creatinine: 1.0 mg/dL (0.6-1.2)
```

### PDF Format
- Lab results from Quest, LabCorp, etc.
- Hospital discharge summaries
- Annual physical reports

### Image Format
- Photos of printed lab reports
- Screenshots of online results
- Scanned documents

## Understanding Results

### Marker Status Colors
- 🟢 **Green (Normal)**: Within reference range
- 🟡 **Yellow (Low)**: Below reference range
- 🟠 **Orange (High)**: Above reference range  
- 🔴 **Red (Critical)**: Significantly abnormal

### Analysis Sections
- **Summary**: Overall health assessment
- **Blood Markers**: Detailed marker table
- **Diet**: Nutritional recommendations
- **Lifestyle**: Exercise and habits
- **Follow-up**: Medical actions needed

## API Key Options

### User Keys (Recommended)
- Enter your OpenAI API key in the UI
- Stored locally in your browser only
- Unlimited usage with better accuracy
- Uses GPT-3.5-turbo model

### Demo Mode (Free)
- Uses our Groq API key
- Limited daily usage
- Uses Llama 3 model
- Perfect for testing

## Troubleshooting

### OCR Not Working
- Ensure image is clear and readable
- Try converting PDF to image
- Check file size (< 10MB recommended)

### Analysis Fails
- Verify API key is correct
- Check network connection
- Try again in demo mode

### Export Issues
- Enable popups in your browser
- Try different browser
- Check available disk space

### Performance Issues
- Close other browser tabs
- Use smaller files
- Check internet speed

## Privacy & Security

- ✅ No server-side data storage
- ✅ API keys stored locally only
- ✅ Processing is stateless
- ✅ No user tracking
- ✅ Open source code

## Getting Help

1. Check this guide first
2. Review error messages carefully  
3. Test with sample data
4. Open GitHub issue if needed

## Medical Disclaimer

⚠️ **This tool is for educational purposes only.**

- Always consult healthcare professionals
- Do not make medical decisions based on AI analysis
- Seek immediate help for critical values
- Verify all results with your doctor

---

**Ready to start? Run `npm run dev` and visit http://localhost:3000!**
