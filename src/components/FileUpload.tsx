'use client'

import { useState, useCallback } from 'react'
import { Upload, Image, AlertCircle } from 'lucide-react'
import { getFromLocalStorage } from '@/lib/utils'

interface FileUploadProps {
  onAnalysisStart: () => void
  onAnalysisComplete: (data: any) => void
}

// Combined image analysis prompt
function createImageAnalysisPrompt(): string {
  return `Please analyze this blood test image and provide a comprehensive assessment. Extract all visible blood markers and their values, then analyze the results.

Please return a JSON response with the following structure:
{
  "markers": [
    {
      "name": "string (marker name like 'Hemoglobin', 'Glucose', etc.)",
      "value": "number or string (the actual value)",
      "unit": "string (unit like mg/dL, g/dL, etc.)", 
      "refRange": "string (reference range if visible)",
      "status": "normal|low|high|critical (based on reference range)"
    }
  ],
  "summary": {
    "overallHealth": "string describing general health status based on the results",
    "keyFindings": ["array of key findings and notable values"],
    "riskFactors": ["array of potential risk factors identified"]
  },
  "recommendations": {
    "diet": ["dietary recommendations based on the results"],
    "lifestyle": ["lifestyle recommendations based on findings"], 
    "followUp": ["follow-up actions or tests that may be needed"]
  }
}

Instructions:
1. Carefully examine the blood test image
2. Extract all visible test markers, values, units, and reference ranges
3. Determine each marker's status by comparing to reference ranges
4. Provide evidence-based health analysis and recommendations
5. Be conservative in interpretations
6. Always emphasize consulting healthcare professionals
7. If image quality is poor or values are unclear, note this in your response

Return only valid JSON - no additional text before or after.`
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

export function FileUpload({ onAnalysisStart, onAnalysisComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    setError(null)
    setUploadedFile(file)
    setIsProcessing(true)

    try {
      if (file.type.startsWith('image/')) {
        const base64 = await convertToBase64(file)
        setImageBase64(base64)
      } else {
        throw new Error('Unsupported file type. Please upload an image file (PNG, JPG, JPEG).')
      }
    } catch (error) {
      console.error('Image processing failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!imageBase64 || !uploadedFile) return

    onAnalysisStart()
    setError(null)

    try {
      const userApiKey = getFromLocalStorage('openai-api-key')
      const selectedModel = getFromLocalStorage('selected-model') || 'gpt-4o-mini'
      
      // Fallback API configuration for OpenRouter
      const FALLBACK_API_KEY = process.env.API_KEY || ''
      const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
      const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
      const FREE_MODEL = 'openai/gpt-4o-mini' // Vision-capable free model
      
      // Determine which API to use
      const useUserKey = userApiKey && userApiKey.startsWith('sk-') && !userApiKey.startsWith('sk-or-')
      const apiUrl = useUserKey ? OPENAI_API_URL : OPENROUTER_API_URL
      const apiKey = useUserKey ? userApiKey : FALLBACK_API_KEY
      const model = useUserKey ? selectedModel : FREE_MODEL
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
      
      // Add OpenRouter specific headers when using fallback
      if (!useUserKey) {
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'Blood Analysis AI'
      }

      // Prepare message with image
      const messages = [
        {
          role: 'system' as const,
          content: SYSTEM_PROMPT
        },
        {
          role: 'user' as const,
          content: [
            {
              type: 'text' as const,
              text: createImageAnalysisPrompt()
            },
            {
              type: 'image_url' as const,
              image_url: {
                url: imageBase64,
                detail: 'high' as const
              }
            }
          ]
        }
      ]

      // Make API request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.3,
          max_tokens: 3000,
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error:', errorData)
        const errorMessage = useUserKey 
          ? 'Analysis failed. Please check your API key and ensure you\'re using a vision-capable model.' 
          : 'Free analysis service temporarily unavailable. Please try again or use your own OpenAI API key.'
        throw new Error(errorMessage)
      }

      const apiResult = await response.json()
      const analysisText = apiResult.choices[0]?.message?.content

      if (!analysisText) {
        throw new Error('No analysis returned from API')
      }

      // Parse the JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response. The AI may not have been able to read the image clearly.')
      }
      
      const analysisResult = JSON.parse(jsonMatch[0])
      
      // Add metadata
      analysisResult.metadata = {
        analyzedAt: new Date().toISOString(),
        confidence: 0.85, // Default confidence for vision analysis
        model: model,
        disclaimer: "This analysis is for educational purposes only. Always consult healthcare professionals for medical decisions."
      }

      onAnalysisComplete(analysisResult)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
      onAnalysisComplete(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Upload className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Upload Blood Test Image</h2>
      </div>
      
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDragging ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Upload className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-xl font-semibold text-gray-900 mb-2">
          Drop your blood test image here
        </p>
        <p className="text-sm text-gray-500 mb-6">
          or click to browse • PNG, JPG, JPEG supported
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Image
        </label>
      </div>

      {/* Uploaded File Info */}
      {uploadedFile && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Image className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Processing */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-300 border-t-amber-600 mr-3"></div>
            <span className="text-sm text-amber-800 font-medium">Preparing image for AI analysis...</span>
          </div>
        </div>
      )}

      {/* Image Ready */}
      {imageBase64 && !isProcessing && (
        <div className="mt-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm text-green-800 font-semibold">
                  Image ready for AI analysis
                </p>
                <p className="text-xs text-green-600">
                  AI will extract and analyze blood markers directly from the image
                </p>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span className="text-lg">🤖</span>
            <span>Analyze Blood Test with AI Vision</span>
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}
