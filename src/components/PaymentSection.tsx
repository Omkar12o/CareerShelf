import { useState, useEffect, useRef } from 'react'

// DOMPurify for sanitizing any scanned data
import DOMPurify from 'isomorphic-dompurify'

export function PaymentSection({ amount, onPaid }: { amount: number; onPaid?: (txnId: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'cancelled'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // QR scanner state
  const [scannedData, setScannedData] = useState<string | null>(null)

  // File upload state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Initialize scanner when component mounts and scanner is requested
  useEffect(() => {
    if (!showScanner) return

    // Note: Instascan is loaded dynamically via script tag in index.html
    // This effect runs when showScanner toggles
    const scan = () => {
      try {
        // @ts-ignore - Instascan global
        const scanner = new (window as any).Instascan.Instascan({ viewMode: 'environment' })

        scanner.on('scan', (text: string) => {
          // SANITIZE the scanned data to prevent XSS
          const sanitized = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
          })
          setScannedData(sanitized)
          setShowScanner(false)
          setMessage('QR code scanned successfully')
          // Auto-clear after 3 seconds
          setTimeout(() => setScannedData(null), 3000)
        })

        scanner.on('error', (error: any) => {
          console.error('Scanner error:', error)
          setMessage('Camera permission denied or scanner error.')
          setShowScanner(false)
        })

        // Get camera access and start scanning
        if (videoRef.current) {
          ;(window as any).Instascan.Camera.getCameras()
            .then((cameras: any[]) => {
              // Prefer back camera, fall back to any available
              const backCamera = cameras.find((c: any) => c.facingMode === 'environment') || cameras[0]
              if (backCamera) {
                scanner.updateStream(backCamera.videoStream)
              }
            })
            .then(() => scanner.start(videoRef.current))
            .catch((e: any) => {
              console.error('Could not start scanner:', e)
              setMessage('Could not access camera. Please allow camera permissions.')
              setShowScanner(false)
            })
        }
      } catch (e) {
        console.error('Instascan initialization error:', e)
        setMessage('Scanner library not loaded. Please refresh the page.')
        setShowScanner(false)
      }
    }

    scan()
  }, [showScanner])

  // Handle scanned QR code data
  useEffect(() => {
    if (scannedData) {
      // Set the scanned data as transaction ID or reference (sanitized)
      const safeRef = scannedData.replace(/[^0-9a-z]/gi, '').substring(0, 20)
      setMessage(`Transaction reference: ${scannedData}`)
      setTimeout(() => setMessage(null), 5000)
    }
  }, [scannedData])

  // Secure file upload handler
  const handleFileUpload = (file: File) => {
    // Allowed file types for payment proof
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB max

    if (file.size > maxSize) {
      setMessage('File too large. Maximum size: 5MB.')
      setTimeout(() => setMessage(null), 3000)
      return false
    }

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage('Invalid file type. Allowed: JPEG, PNG, GIF, PDF.')
      setTimeout(() => setMessage(null), 3000)
      return false
    }

    setUploading(true)
    setUploadProgress(0)

    const reader = new FileReader()
    reader.onload = (e: any) => {
      const dataUrl = e.target.result
      // Don't store the full image data - just note the upload
      setMessage(`Uploaded: ${file.name} (${((file.size / 1024) / 1024).toFixed(2)}MB)`)
      setUploadProgress(100)
      setUploading(false)

      // Auto-clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    }

    reader.onerror = (e) => {
      setMessage('Error reading file. Please try again.')
      setUploading(false)
      setTimeout(() => setMessage(null), 3000)
    }

    reader.readAsDataURL(file)
    return true
  }

  // Youpi payment handler
  const handleYoupiPayment = () => {
    if (!window.Youpi) {
      setStatus('error')
      setMessage('Youpi gateway not loaded. Please try again.')
      return
    }

    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)

    setStatus('loading')
    setMessage('Opening secure payment popup...')

    window.Youpi.pay({
      order_id: orderId,
      amount: amount * 100, // Youpi expects paise
      currency: 'INR',
      name: 'CareerShelf',
      description: 'Payment for products/services',
      theme: {
        color: '#4f46e5',
      },
      handler: (response: any) => {
        // response contains order_id, utr, status from the gateway
        // We DO NOT mark the order as paid here - webhook handles that
        setStatus('success')
        setMessage('Payment processed. Verification via webhook...')
        if (onPaid) {
          onPaid(response.order_id || '')
        }
      },
      onClose: () => {
        setStatus('cancelled')
        setMessage('Payment cancelled.')
        if (onPaid) {
          onPaid('')
        }
      },
    })
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">Pay via UPI</h3>
        <p className="mt-1 text-sm text-gray-500">UPI ID: 9146601241@axl</p>
        <p className="mt-1 text-sm text-gray-500">Amount: {amount > 0 ? `₹${amount}` : 'As quoted'}</p>

        {/* QR Scanner Button */}
        {showScanner ? (
          <div className="mt-3">
            <video ref={videoRef} className="rounded w-full max-h-[300px] object-cover" autoplay playsInline></video>
            <canvas ref={canvasRef} className="hidden w-full max-h-[300px]" /></div>
        ) : (
          <button
            onClick={() => setShowScanner(true)}
            className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            Scan QR Code
          </button>
        )}

        {/* File upload alternative with security validation */}
        <button
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*, .pdf'
            input.onchange = (e: any) => {
              const file = e.target.files[0]
              if (file && handleFileUpload(file)) {
                // File uploaded successfully - send to webhook for verification
                // TODO: Send file to your backend webhook for virus scan etc.
                console.log('Payment proof uploaded:', file.name, file.size)
              }
            }
            input.click()
          }}
          className="mt-2 w-full rounded-xl bg-gray-200 px-4 py-2.5 text-sm text-gray-700"
        >
          Upload Payment Proof (Max 5MB, JPEG/PNG/PDF)
        </button>

        {scannedData && (
          <p className="mt-2 text-sm text-green-600">Scanned: {scannedData}</p>
        )}

        {status === 'loading' && <p className="mt-2 text-sm text-gray-500">Processing...</p>}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">Payment Status</h3>
        {status === 'idle' && <p className="text-sm text-gray-500">Click pay to start.</p>}
        {status === 'loading' && <p className="text-sm text-gray-500">Opening payment popup...</p>}
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-600">Payment received! Verifying...</p>
        )}
        {status === 'error' && <p className="mt-2 text-sm text-red-600">Payment error.</p>}
        {status === 'cancelled' && <p className="mt-2 text-sm text-gray-500">Payment cancelled.</p>}
      </div>
    </section>
  )
}