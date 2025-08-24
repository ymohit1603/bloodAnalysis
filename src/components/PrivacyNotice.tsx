'use client'

import { Shield, Lock, Eye, Database } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-bold text-green-800 mb-3">
            🔒 100% Privacy Guaranteed
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Database className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">No Data Storage</h4>
                <p className="text-green-700 text-sm">
                  Your blood test reports are never stored on our servers
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Secure API Keys</h4>
                <p className="text-green-700 text-sm">
                  Your API keys are stored only in your browser, never on our backend
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Eye className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">AI Vision Analysis</h4>
                <p className="text-green-700 text-sm">
                  Images are analyzed directly by AI vision models - no intermediate processing
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Zero Tracking</h4>
                <p className="text-green-700 text-sm">
                  No personal data collection or tracking whatsoever
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              ✅ Everything happens locally in your browser - your privacy is completely protected
            </p>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 font-medium text-center">
              🆓 FREE AI vision analysis - no OCR needed, AI reads your images directly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
