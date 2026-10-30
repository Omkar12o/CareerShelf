import { CheckCircle2, Clock, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'

export type PaymentStatusType =
  | 'idle'
  | 'order_placed'
  | 'payment_submitted'
  | 'verifying'
  | 'confirmed'
  | 'failed'

export interface PaymentStatusProps {
  status: PaymentStatusType
  orderId?: string
  amount?: number
  utr?: string
  estimatedHours?: number
  onRetry?: () => void
  onGoToPurchases?: () => void
}

const STATUS_CONFIG: Record<PaymentStatusType, {
  label: string
  icon: React.ReactNode
  color: string
  subtitle: string
}> = {
  idle: {
    label: 'Order placed',
    icon: <CheckCircle2 className="w-4 h-4 text-[#736E66]" />,
    color: 'text-[#736E66]',
    subtitle: 'Waiting for payment',
  },
  order_placed: {
    label: 'Order placed',
    icon: <CheckCircle2 className="w-4 h-4 text-[#141414]" />,
    color: 'text-[#141414]',
    subtitle: 'Order confirmed, awaiting payment',
  },
  payment_submitted: {
    label: 'Payment submitted',
    icon: <Clock className="w-4 h-4 text-[#141414]" />,
    color: 'text-[#141414]',
    subtitle: 'Screenshot uploaded, waiting for verification',
  },
  verifying: {
    label: 'Under verification',
    icon: <Loader2Pulse className="w-4 h-4 text-[#B45309]" />,
    color: 'text-[#B45309]',
    subtitle: 'Our team is reviewing your payment',
  },
  confirmed: {
    label: 'Confirmed',
    icon: <CheckCircle2 className="w-4 h-4 text-[#15803d]" />,
    color: 'text-[#15803d]',
    subtitle: 'Payment received successfully',
  },
  failed: {
    label: 'Failed',
    icon: <AlertCircle className="w-4 h-4 text-[#942B2B]" />,
    color: 'text-[#942B2B]',
    subtitle: 'Payment could not be verified',
  },
}

function Loader2Pulse({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )
}

export function PaymentStatus({
  status,
  orderId,
  amount,
  utr,
  estimatedHours = 24,
  onRetry,
  onGoToPurchases,
}: PaymentStatusProps) {
  const steps: PaymentStatusType[] = ['order_placed', 'payment_submitted', 'verifying', 'confirmed']
  const currentIndex = steps.indexOf(status)

  const isTerminal = status === 'confirmed' || status === 'failed'
  const isVerifying = status === 'verifying'

  return (
    <div className="space-y-4">
      {/* Status timeline */}
      <div className="relative space-y-3">
        <div className="absolute left-2.5 top-4 bottom-4 w-[1px] bg-[#DDD5C7] hidden lg:block" />
        {steps.map((step, i) => {
          const config = STATUS_CONFIG[step]
          const isActive = step === status
          const isCompleted = currentIndex > i
          const isPending = currentIndex < i

          return (
            <div key={step} className="flex items-start gap-3 relative z-10">
              <div className="relative flex-shrink-0">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#15803d] flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 fill-[#15803d]" />
                  </div>
                ) : isActive && isVerifying ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#B45309] flex items-center justify-center">
                    <Loader2Pulse className="w-3 h-3 text-[#B45309]" />
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-[#141414] text-[#F6F3ED] flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-[#DDD5C7] bg-white flex items-center justify-center text-[#736E66] text-xs">
                    {i + 1}
                  </div>
                )}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${config.color} mb-0.5`}>
                  {config.label}
                </p>
                <p className={`text-[10px] ${isCompleted || isActive ? 'text-[#403D37]' : 'text-[#736E66]'}`}>
                  {isActive ? config.subtitle : isPending ? 'Pending' : 'Completed'}
                </p>
              </div>
              {i < steps.length - 1 && !isPending && (
                <ArrowRight className="w-3 h-3 text-[#DDD5C7] self-end -mb-4" />
              )}
            </div>
          )
        })}
      </div>

      {/* Order details */}
      <div className="bg-[#F4EFE6] border border-[#E3DDD4] rounded-lg p-4">
        {orderId && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#736E66]">
              Order ID
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-[#141414] truncate max-w-[150px]">{orderId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderId || '')
                }}
                className="text-[10px] font-medium underline-offset-2 underline decoration-1 decoration-transparent hover:decoration-[#141414] transition-colors text-[#4A4742]"
                aria-label="Copy order ID"
              >
                Copy
              </button>
            </div>
          </div>
        )}
        {utr && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#736E66]">
              Transaction ID
            </span>
            <span className="text-sm font-mono text-[#403D37] truncate max-w-[150px]">{utr}</span>
          </div>
        )}
        {amount !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#736E66]">Amount paid</span>
            <span className="text-[#141414] font-bold">₹{amount.toLocaleString()}</span>
          </div>
        )}
        <p className="mt-3 text-[10px] text-[#736E66] leading-relaxed">
          Verification usually takes up to {estimatedHours} hours. We'll notify you once confirmed.
        </p>
      </div>

      {/* Terminal states */}
      {status === 'confirmed' && (
        <div className="bg-white border border-[#E3DDD4] rounded-lg p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#15803d]" />
          </div>
          <h3 className="text-base font-bold text-[#141414] mb-1">Payment received</h3>
          <p className="text-sm text-[#736E66] mb-4">Your order has been confirmed and is being processed.</p>
          <button
            onClick={onGoToPurchases}
            className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] px-4 py-2.5 text-sm font-semibold hover:bg-[#2C2B29] transition-colors"
          >
            Go to My purchases
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-white border border-[#E3DDD4] rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#942B2B] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-[#141414] mb-1">Payment failed</h3>
              <p className="text-sm text-[#736E66] mb-3">
                We couldn't verify your payment. Please try again or contact support.
              </p>
              <button
                onClick={onRetry}
                className="rounded-lg border border-[#DDD5C7] bg-white px-4 py-2.5 text-sm font-semibold text-[#141414] hover:bg-[#F4EFE6] transition-colors"
              >
                Retry payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}