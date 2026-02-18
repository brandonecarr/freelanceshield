interface PdfExtractResult {
  text: string
  page_count: number
  char_count: number
}

export async function extractPdfText(file: File): Promise<PdfExtractResult> {
  const pdfServiceUrl = process.env.PDF_SERVICE_URL

  if (!pdfServiceUrl) {
    throw new Error('PDF_SERVICE_URL environment variable is not set')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${pdfServiceUrl}/extract`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    const detail = data.detail
    if (typeof detail === 'object' && detail?.message) {
      throw new PdfExtractionError(detail.message, detail.error)
    }
    throw new PdfExtractionError(
      detail || 'Failed to extract text from PDF',
      'extraction_failed'
    )
  }

  return {
    text: data.text,
    page_count: data.page_count,
    char_count: data.char_count,
  }
}

export class PdfExtractionError extends Error {
  errorCode: string

  constructor(message: string, errorCode: string) {
    super(message)
    this.name = 'PdfExtractionError'
    this.errorCode = errorCode
  }
}
