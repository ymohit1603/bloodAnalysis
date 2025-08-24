import { NextRequest, NextResponse } from 'next/server'
import { AnalysisResultSchema } from '@/types/blood-analysis'
import type { AnalyzeRequest, AnalyzeResponse, BloodMarker } from '@/types/blood-analysis'

// Free API fallback - Using Groq for free LLM access
const FALLBACK_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const FALLBACK_API_KEY = process.env.GROQ_API_KEY || 'gsk_demo_key' // You'll need to set this
const FALLBACK_MODEL = 'llama3-8b-8192'

// OpenAI settings for user-provided keys
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-3.5-turbo'

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { ocrResults, userApiKey } = body

    if (!ocrResults || !ocrResults.markers) {
      return NextResponse.json({
        success: false,
        error: 'Invalid OCR results provided'
      } as AnalyzeResponse, { status: 400 })
    }

    // Prepare the analysis prompt
    const analysisPrompt = createAnalysisPrompt(ocrResults.markers, ocrResults.text)

    // Determine which API to use
    const useUserKey = userApiKey && userApiKey.startsWith('sk-')
    const apiUrl = useUserKey ? OPENAI_API_URL : FALLBACK_API_URL
    const apiKey = useUserKey ? userApiKey : FALLBACK_API_KEY
    const model = useUserKey ? OPENAI_MODEL : FALLBACK_MODEL

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error:', errorData)
      return NextResponse.json({
        success: false,
        error: `Analysis service temporarily unavailable. ${useUserKey ? 'Please check your API key.' : 'Please try again later.'}`
      } as AnalyzeResponse, { status: 500 })
    }

    const apiResult = await response.json()
    const analysisText = apiResult.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis returned from API')
    }

    // Parse the JSON response
    let analysisResult
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      analysisResult = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      const validatedResult = AnalysisResultSchema.parse(analysisResult)

      // Add metadata
      validatedResult.metadata = {
        analyzedAt: new Date().toISOString(),
        confidence: ocrResults.confidence * 0.9, // Slightly reduce confidence due to AI analysis
        model: model,
        disclaimer: "This analysis is for educational purposes only. Always consult healthcare professionals for medical decisions."
      }

      return NextResponse.json({
        success: true,
        data: validatedResult
      } as AnalyzeResponse)

    } catch (parseError) {
      console.error('Failed to parse analysis result:', parseError)
      console.error('Raw response:', analysisText)
      
      return NextResponse.json({
        success: false,
        error: 'Failed to process analysis results. Please try again.'
      } as AnalyzeResponse, { status: 500 })
    }

  } catch (error) {
    console.error('Analysis API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    } as AnalyzeResponse, { status: 500 })
  }
}

function createAnalysisPrompt(markers: BloodMarker[], rawText: string): string {
  return `Please analyze the following blood test results and provide a comprehensive assessment.

RAW OCR TEXT:
${rawText}

EXTRACTED MARKERS:
${JSON.stringify(markers, null, 2)}

Please analyze these results and return a JSON response with the following structure:
{
  "markers": [
    {
      "name": "string",
      "value": "number or string",
      "unit": "string", 
      "refRange": "string",
      "status": "normal|low|high|critical"
    }
  ],
  "summary": {
    "overallHealth": "string describing general health status",
    "keyFindings": ["array of key findings"],
    "riskFactors": ["array of potential risk factors"]
  },
  "recommendations": {
    "diet": ["dietary recommendations"],
    "lifestyle": ["lifestyle recommendations"], 
    "followUp": ["follow-up actions needed"]
  }
}

For each marker, determine the status by comparing the value to the reference range:
- "normal": within reference range
- "low": below reference range  
- "high": above reference range
- "critical": significantly outside range requiring immediate attention

Provide practical, evidence-based recommendations. Be conservative and always emphasize consulting healthcare professionals.`
}

const SYSTEM_PROMPT = `You are a medical AI assistant that analyzes blood test results. Your role is to:

1. Interpret blood marker values against reference ranges
2. Identify potential health concerns or patterns
3. Provide educational information about findings
4. Suggest general wellness recommendations
5. Emphasize the importance of professional medical consultation

Guidelines:
- Always be conservative in interpretations
- Flag critical values that need immediate medical attention
- Provide clear, understandable explanations
- Focus on general wellness and prevention
- Never diagnose specific conditions
- Always recommend consulting healthcare professionals
- Return responses in valid JSON format only

Remember: This is educational information only, not medical advice.`
