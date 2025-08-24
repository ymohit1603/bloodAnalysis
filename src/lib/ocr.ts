import { createWorker } from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'
import type { BloodMarker, OCRResult } from '@/types/blood-analysis'

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`

// Tesseract OCR for images
export async function processImage(file: File): Promise<OCRResult> {
  const worker = await createWorker()
  
  try {
    const { data: { text, confidence } } = await worker.recognize(file)
    const markers = parseBloodTestText(text)
    
    return {
      text,
      confidence: confidence / 100, // Convert to 0-1 range
      markers
    }
  } finally {
    await worker.terminate()
  }
}

// PDF processing with PDF.js
export async function processPDF(file: File): Promise<OCRResult> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  
  let fullText = ''
  let totalConfidence = 0
  
  // Process each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    
    fullText += pageText + '\n'
    totalConfidence += 0.9 // PDF text extraction is generally high confidence
  }
  
  const avgConfidence = totalConfidence / pdf.numPages
  const markers = parseBloodTestText(fullText)
  
  return {
    text: fullText,
    confidence: avgConfidence,
    markers
  }
}

// Parse blood test text to extract markers
function parseBloodTestText(text: string): BloodMarker[] {
  const markers: BloodMarker[] = []
  const lines = text.split('\n')
  
  // Common blood test patterns
  const patterns = [
    // Pattern: "Hemoglobin 14.5 g/dL (12.0-16.0)"
    /(\w+(?:\s+\w+)*)\s+([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z\/]+)\s*\(([^)]+)\)/g,
    // Pattern: "Glucose: 95 mg/dL Ref: 70-100"
    /(\w+(?:\s+\w+)*):?\s+([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z\/]+)\s*(?:Ref:?\s*)?([0-9-.\s]+)/g,
  ]
  
  for (const line of lines) {
    for (const pattern of patterns) {
      let match
      pattern.lastIndex = 0 // Reset pattern state
      const matches: RegExpExecArray[] = []
      
      while ((match = pattern.exec(line)) !== null) {
        matches.push(match)
        if (!pattern.global) break // Prevent infinite loop for non-global patterns
      }
      
      for (const match of matches) {
        const [, name, value, unit, refRange] = match
        
        if (name && value && unit) {
          markers.push({
            name: name.trim(),
            value: parseFloat(value),
            unit: unit.trim(),
            refRange: refRange?.trim() || 'N/A'
          })
        }
      }
    }
  }
  
  return markers
}
