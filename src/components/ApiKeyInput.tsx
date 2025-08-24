'use client'

import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Info, Cpu } from 'lucide-react'
import { saveToLocalStorage, getFromLocalStorage } from '@/lib/utils'

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const availableModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Vision-capable, fast and cost-effective' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable vision model' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance with vision' },
    { id: 'gpt-4o-2024-08-06', name: 'GPT-4o (Latest)', description: 'Latest vision model' }
  ]

  const getFreeModelName = () => 'GPT-4o Mini (Free - Vision Enabled)'

  useEffect(() => {
    const savedApiKey = getFromLocalStorage('openai-api-key')
    const savedModel = getFromLocalStorage('selected-model')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    if (savedModel) {
      setSelectedModel(savedModel)
    }
  }, [])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (value) {
      saveToLocalStorage('openai-api-key', value)
    } else {
      localStorage.removeItem('openai-api-key')
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    saveToLocalStorage('selected-model', modelId)
  }

  const clearApiKey = () => {
    setApiKey('')
    localStorage.removeItem('openai-api-key')
  }

  const getSelectedModelName = () => {
    if (!apiKey) {
      return getFreeModelName()
    }
    return availableModels.find(model => model.id === selectedModel)?.name || selectedModel
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Key className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">AI Model Configuration</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isExpanded ? 'Hide' : 'Configure'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="text-blue-900 font-semibold mb-1">Configure your AI model (Optional)</p>
                <p className="text-blue-700">
                  Free AI vision analysis available! Provide your OpenAI API key for premium models, 
                  or use our free service with GPT-4o Mini. AI directly reads and analyzes your blood test images - 
                  no data passes through our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
              <Cpu className="inline h-4 w-4 mr-1" />
              AI Model
            </label>
            {apiKey ? (
              <>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Each model has different capabilities and pricing. GPT-4o Mini is recommended for most users.
                </p>
              </>
            ) : (
              <>
                <div className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-800">
                  {getFreeModelName()} - AI Vision Analysis
                </div>
                <p className="mt-1 text-xs text-blue-600">
                  🆓 Free AI vision analysis! No API key needed - analyzes blood test images directly.
                </p>
              </>
            )}
          </div>

          {/* API Key Input */}
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="api-key"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 transition-all duration-200 hover:border-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={clearApiKey}
                    className="p-1 text-red-400 hover:text-red-600 text-sm rounded hover:bg-red-50"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your API key is stored locally in your browser and never sent to our servers
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Status: {apiKey ? (
                <span className="text-green-600 font-medium">Ready with {getSelectedModelName()}</span>
              ) : (
                <span className="text-blue-600 font-medium">Ready with free GPT-4o Mini vision</span>
              )}
            </span>
            
            {apiKey && (
              <span className="text-gray-500">
                Key: ...{apiKey.slice(-8)}
              </span>
            )}
          </div>

          {/* Get API Key Link */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Don&apos;t have an API key? {' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Get one from OpenAI
              </a>
            </p>
          </div>
        </div>
      )}

      {!isExpanded && apiKey && (
        <p className="text-sm text-green-600">
          ✓ Ready with {getSelectedModelName()}
        </p>
      )}
      
      {!isExpanded && !apiKey && (
        <p className="text-sm text-blue-600">
          🆓 Free AI vision analysis ready with GPT-4o Mini
        </p>
      )}
    </div>
  )
}
