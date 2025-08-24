'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ApiKeyInput } from '@/components/ApiKeyInput'
import { AnalysisResults } from '@/components/AnalysisResults'
import { PrivacyNotice } from '@/components/PrivacyNotice'

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
              <span className="text-2xl">🩸</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
              Blood Analysis AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your blood test images and let AI vision models extract and analyze results instantly
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              🤖 FREE AI Vision Analysis - No OCR, Direct Image Reading
            </div>
          </div>

          {/* Privacy Notice */}
          <PrivacyNotice />

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* API Key Input */}
            <div>
              <ApiKeyInput />
            </div>
            
            {/* File Upload */}
            <div>
              <FileUpload 
                onAnalysisStart={() => setIsLoading(true)}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto" style={{animationDelay: '0.5s'}}></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Blood Test</h3>
              <p className="text-gray-600 mb-4">Our AI is carefully reviewing your results...</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}

          {/* Results */}
          {analysisData && !isLoading && (
            <AnalysisResults data={analysisData} />
          )}
        </div>
      </div>
    </main>
  )
}
