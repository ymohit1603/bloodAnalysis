import { z } from 'zod'

// Blood marker data structure
export const BloodMarkerSchema = z.object({
  name: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string(),
  refRange: z.string(),
  status: z.enum(['normal', 'low', 'high', 'critical']).optional(),
  confidence: z.number().min(0).max(1).optional(),
})

export type BloodMarker = z.infer<typeof BloodMarkerSchema>

// Analysis result structure
export const AnalysisResultSchema = z.object({
  markers: z.array(BloodMarkerSchema),
  summary: z.object({
    overallHealth: z.string(),
    keyFindings: z.array(z.string()),
    riskFactors: z.array(z.string()),
  }),
  recommendations: z.object({
    diet: z.array(z.string()),
    lifestyle: z.array(z.string()),
    followUp: z.array(z.string()),
  }),
  metadata: z.object({
    analyzedAt: z.string(),
    confidence: z.number(),
    model: z.string(),
    disclaimer: z.string(),
  }),
})

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>

// OCR result structure
export interface OCRResult {
  text: string
  confidence: number
  markers: BloodMarker[]
}

// API request/response types
export interface AnalyzeRequest {
  ocrResults: OCRResult
  userApiKey?: string
}

export interface AnalyzeResponse {
  success: boolean
  data?: AnalysisResult
  error?: string
}
