'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export function MedicalDisclaimer() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            ⚠️ Medical Disclaimer
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="mb-2">
              <strong>This tool is for educational purposes only and should NOT be used as a substitute for professional medical advice.</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI analysis may contain errors or inaccuracies</li>
              <li>Always consult with a qualified healthcare professional</li>
              <li>Do not make medical decisions based solely on this analysis</li>
              <li>In case of emergency or critical values, seek immediate medical attention</li>
            </ul>
            <p className="mt-2 text-xs text-red-600">
              By using this tool, you acknowledge that the analysis is provided &quot;as-is&quot; without warranty and that you will consult appropriate medical professionals for health-related decisions.
            </p>
          </div>
        </div>
        <div className="ml-auto flex-shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="rounded-md bg-red-50 p-1.5 text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
