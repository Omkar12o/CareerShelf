import { useState } from 'react'
import { Copy, QrCode, Smartphone, Link2 } from 'lucide-react'

export interface UpiPaymentProps {
  upiId: string
  amount: number
  qrImageUrl?: string
  onUpiPaid?: (txnId: string) => void
}

export function UpiPayment({ upiId, amount, qrImageUrl, onUpiPaid }: UpiPaymentProps) {
  const [copied, setCopied] = useState<'upiId' | 'amount' | null>(null)
  const [deepLinkCopied, setDeepLinkCopied] = useState(false)

  const handleCopy = (text: string, type: 'upiId' | 'amount') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&cu=INR&pn=CareerShelf`

  const handleDeepLinkCopy = () => {
    navigator.clipboard.writeText(upiDeepLink)
    setDeepLinkCopied(true)
    setTimeout(() => setDeepLinkCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3DDD4] rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          {/* QR Code side */}
          <div className="bg-[#F4EFE6] border border-[#E3DDD4] rounded-lg p-3 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#736E66] mb-1">
              Scan this QR
            </span>
            <div className="relative w-24 h-24 flex items-center justify-center">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="UPI QR" className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="w-full h-full bg-white border border-[#DDD5C7] rounded-md flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-[#141414]" />
                </div>
              )}
            </div>
            <p className="mt-2 text-[10px] text-[#736E66] leading-tight text-center">
              Scan with GPay, PhonePe, Paytm or any UPI app
            </p>
          </div>

          {/* UPI Details side */}
          <div className="flex flex-col justify-center space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-medium text-[#141414]">UPI ID</span>
                <button
                  onClick={() => handleCopy(upiId, 'upiId')}
                  className={`text-xs font-medium underline-offset-2 underline decoration-1 decoration-transparent hover:decoration-[#141414] transition-colors ${
                    copied === 'upiId' ? 'text-[#15803d]' : 'text-[#4A4742]'
                  }`}
                >
                  Copy
                </button>
                {copied === 'upiId' && (
                  <span className="text-[10px] text-[#15803d] font-bold">✓ Copied</span>
                )}
              </div>
              <p className="text-base font-mono font-bold text-[#141414] truncate">{upiId}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-medium text-[#141414]">Amount</span>
                <button
                  onClick={() => handleCopy(amount.toString(), 'amount')}
                  className={`text-xs font-medium underline-offset-2 underline decoration-1 decoration-transparent hover:decoration-[#141414] transition-colors ${
                    copied === 'amount' ? 'text-[#15803d]' : 'text-[#4A4742]'
                  }`}
                >
                  Copy
                </button>
                {copied === 'amount' && (
                  <span className="text-[10px] text-[#15803d] font-bold">✓ Copied</span>
                )}
              </div>
              <p className="text-base font-bold text-[#141414]">₹{amount.toLocaleString()}</p>
            </div>

            <button
              onClick={handleDeepLinkCopy}
              className="w-full py-2 rounded-lg bg-[#141414] text-[#F6F3ED] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#2C2B29] transition-colors"
            >
              <Smartphone className="w-3 h-3" />
              <span>Pay with UPI app</span>
              {deepLinkCopied ? (
                <span className="text-[10px] text-[#15803d] font-bold">✓</span>
              ) : (
                <Link2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#504C46] mt-1">
        <span className="w-1 h-1 rounded-full bg-[#141414]"></span>
        Paid via UPI — verified instantly
      </div>
    </div>
  )
}