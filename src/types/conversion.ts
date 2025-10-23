export type ConversionStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'

export type ConversionFormat =
  | 'PDF'
  | 'DOCX'
  | 'PPTX'
  | 'XLSX'
  | 'HTML'
  | 'MARKDOWN'
  | 'TXT'
  | 'PNG'
  | 'JPG'

export interface ConversionJob {
  id: string
  sourceFileName: string
  sourceFilePath: string
  sourceFileSize?: number
  sourceMimeType?: string
  outputFormat: ConversionFormat
  status: ConversionStatus
  statusReason?: string
  expiresAt?: Date
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  outputs?: ConversionOutputFile[]
  events?: ConversionEvent[]
}

export interface ConversionOutputFile {
  id: string
  jobId: string
  format: ConversionFormat
  filePath: string
  fileSize?: number
  checksum?: string
  createdAt: Date
  updatedAt: Date
  job?: ConversionJob
}

export interface ConversionEvent {
  id: string
  jobId: string
  status?: ConversionStatus
  message?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  job?: ConversionJob
}
