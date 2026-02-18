'use client'

import { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError('')

      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0]
        if (err.message.includes('file-too-large')) {
          setError('File is too large. Maximum size is 10MB.')
        } else if (err.message.includes('file-invalid-type')) {
          setError('Only PDF files are accepted.')
        } else {
          setError(err.message)
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled,
  })

  function clearFile() {
    setSelectedFile(null)
    setError('')
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50',
          disabled && 'opacity-50 cursor-not-allowed',
          selectedFile && 'border-green-300 bg-green-50'
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-base font-medium text-gray-700">
              {isDragActive ? 'Drop your contract here' : 'Upload your contract'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">PDF only, up to 10MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
