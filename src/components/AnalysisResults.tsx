'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { getStatusColor, formatValue } from '@/lib/utils'
import type { AnalysisResult, BloodMarker } from '@/types/blood-analysis'
import html2canvas from 'html2canvas'

interface AnalysisResultsProps {
  data: AnalysisResult
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    markers: true,
    diet: false,
    lifestyle: false,
    followUp: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getMarkerIcon = (status: string = 'normal') => {
    switch (status.toLowerCase()) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'high':
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'normal':
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const exportAsImage = async () => {
    const element = document.getElementById('analysis-results')
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: 'white',
          scale: 2,
          logging: false,
        })
        
        const link = document.createElement('a')
        link.download = `blood-analysis-${new Date().toISOString().split('T')[0]}.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('Export failed:', error)
        alert('Export failed. Please try again.')
      }
    }
  }

  // Check for critical markers
  const criticalMarkers = data.markers.filter(marker => marker.status === 'critical')

  return (
    <div id="analysis-results" className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Blood Test Analysis</h2>
            <p className="text-blue-100 mt-1">
              Analyzed on {new Date(data.metadata.analyzedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={exportAsImage}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>


      </div>

      {/* Critical Alerts */}
      {criticalMarkers.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Critical Values Detected</h3>
              <p className="text-red-700 text-sm mt-1">
                {criticalMarkers.length} marker(s) show critical values. Please consult a healthcare professional immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <CollapsibleSection
        title="Summary"
        icon="📊"
        expanded={expandedSections.summary}
        onToggle={() => toggleSection('summary')}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Overall Health Assessment</h4>
            <p className="text-gray-700">{data.summary.overallHealth}</p>
          </div>

          {data.summary.keyFindings.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.summary.keyFindings.map((finding, index) => (
                  <li key={index} className="text-gray-700">{finding}</li>
                ))}
              </ul>
            </div>
          )}

          {data.summary.riskFactors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-red-700">Risk Factors</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.summary.riskFactors.map((risk, index) => (
                  <li key={index} className="text-red-600">{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Markers Section */}
      <CollapsibleSection
        title="Blood Markers"
        icon="🧪"
        expanded={expandedSections.markers}
        onToggle={() => toggleSection('markers')}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marker
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Range
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.markers.map((marker, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {getMarkerIcon(marker.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{marker.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(marker.status)}`}>
                      {formatValue(marker.value, marker.unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {marker.refRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* Diet Recommendations */}
      <CollapsibleSection
        title="Diet Recommendations"
        icon="🥗"
        expanded={expandedSections.diet}
        onToggle={() => toggleSection('diet')}
      >
        <ul className="space-y-2">
          {data.recommendations.diet.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Lifestyle Recommendations */}
      <CollapsibleSection
        title="Lifestyle Recommendations"
        icon="🏃‍♂️"
        expanded={expandedSections.lifestyle}
        onToggle={() => toggleSection('lifestyle')}
      >
        <ul className="space-y-2">
          {data.recommendations.lifestyle.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Follow-up Recommendations */}
      <CollapsibleSection
        title="Follow-up Actions"
        icon="📅"
        expanded={expandedSections.followUp}
        onToggle={() => toggleSection('followUp')}
      >
        <ul className="space-y-2">
          {data.recommendations.followUp.map((action, index) => (
            <li key={index} className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{action}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Footer with disclaimer */}
      <div className="bg-gray-50 px-6 py-4">
        <p className="text-xs text-gray-600">
          <strong>Model:</strong> {data.metadata.model} • 
          <strong> Generated:</strong> {new Date(data.metadata.analyzedAt).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {data.metadata.disclaimer}
        </p>
      </div>
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  icon: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({ title, icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-xl mr-3">{icon}</span>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {expanded && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
