import { useState, FormEvent } from 'react'
import { Upload, FileImage, FileText, Trash2, Loader2 } from 'lucide-react'

export interface ProofUploadProps {
  onSubmit: (file: File | null, utr: string) => void
  submitting?: boolean
  disabled?: boolean
}

export function ProofUpload({ onSubmit, submitting = false, disabled = false }: ProofUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [utr, setUtr] = useState('')

  const MAX_SIZE = 5 * 1024 * 1024
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

  const hasData = Boolean(file) || utr.trim().length > 0

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > MAX_SIZE) {
      alert('File too large. Maximum size: 5MB.')
      return
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type) && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Invalid file type. Allowed: JPEG, PNG, GIF, PDF.')
      return
    }
    setFile(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer?.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!hasData) return
    onSubmit(file, utr.trim())
  }

  const fileIcon = file?.type === 'application/pdf' ? <FileText className="w-5 h-5 text-[#736E66]" /> : <FileImage className="w-5 h-5 text-[#736E66]" />

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dragOver
          ? 'rounded-lg border-2 border-dashed border-[#141414] bg-[#F4EFE6] p-6 text-center transition-all duration-150'
          : 'rounded-lg border-2 border-dashed border-[#DDD5C7] bg-white p-6 text-center hover:border-[#C9C1B5] transition-all duration-150'
        }
      >
        <Upload className="w-6 h-6 mb-2 text-[#736E66]" />
        <p className="text-sm font-medium text-[#141414]">Upload payment screenshot</p>
        <p className="text-xs text-[#736E66]">JPEG / PNG / PDF, max 5MB</p>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFileSelect(f)
          }}
          className="hidden"
          aria-label="Upload payment proof"
        />
      </div>

      {file && (
        <div className="flex items-center justify-between gap-3 bg-[#F4EFE6] border border-[#E3DDD4] rounded-lg p-3">
          <div className="flex items-center gap-2">
            {fileIcon}
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#141414] truncate" title={file.name}>{file.name}</p>
              <p className="text-[10px] text-[#736E66]">{((file.size / 1024 / 1024).toFixed(2)) + ' MB'}</p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-[10px] font-medium text-[#736E66] hover:text-[#942B2B] transition-colors p-1"
            aria-label="Remove uploaded file"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-xs font-medium text-[#141414] uppercase tracking-wider">
          Transaction ID (UTR) <span className="text-xs font-normal text-[#736E66]">optional</span>
        </label>
        <input
          type="text"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter UTR / transaction ID"
          className="w-full rounded-lg border border-[#DDD5C7] bg-white px-3 py-2.5 text-sm text-[#141414] focus:outline-none focus:border-[#141414] focus:ring-1 focus:ring-[#141414] disabled:opacity-50 disabled:pointer-events-none"
          disabled={disabled}
          aria-label="Transaction ID"
        />
      </div>

      <button
        type="submit"
        disabled={!hasData || submitting || disabled}
        className={hasData && !submitting && !disabled
          ? 'w-full rounded-lg bg-[#141414] text-[#F6F3ED] px-4 py-2.5 text-sm font-bold hover:bg-[#2C2B29] shadow-sm transition-all duration-150'
          : 'w-full rounded-lg bg-[#F4EFE6] text-[#736E66] px-4 py-2.5 text-sm font-bold border border-[#DDD5C7] cursor-not-allowed'
        }
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying\u2026
          </>
        ) : (
          'Submit for verification'
        )}
      </button>

      {!hasData && !disabled && (
        <p className="text-[10px] text-[#736E66] text-center">Upload a screenshot or enter a UTR to proceed.</p>
      )}
    </form>
  )
}