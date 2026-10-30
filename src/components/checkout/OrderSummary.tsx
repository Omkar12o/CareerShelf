import { Package, ShieldCheck, HelpCircle } from 'lucide-react'

export interface OrderSummaryProps {
  productTitle: string
  productTier?: string
  productPrice: number
  documentationIncluded: boolean
  hasDiscount?: boolean
  discountAmount?: number
  gstAmount?: number
  onContact?: () => void
}

export function OrderSummary({
  productTitle,
  productTier,
  productPrice,
  documentationIncluded = true,
  hasDiscount = false,
  discountAmount,
  gstAmount,
  onContact,
}: OrderSummaryProps) {
  const basePrice = productPrice
  const discount = hasDiscount ? discountAmount ?? 0 : 0
  const gst = gstAmount ?? 0
  const subtotal = basePrice - discount
  const orderTotal = subtotal + gst

  return (
    <div className="sticky top-24 w-full lg:w-full">
      <div className="bg-white border border-[#E3DDD4] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F0EAE1] bg-[#F6F3ED]/50 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F4EFE6] border border-[#E3DDD4] flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-[#141414]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-medium text-[#141414] leading-tight">
              {productTitle}
            </h3>
            {productTier && (
              <p className="text-[10px] uppercase font-semibold tracking-wider text-[#736E66] mt-0.5">
                {productTier}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Line items */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#736E66]">Project price</span>
              <span className="text-[#141414] font-medium">₹{basePrice.toLocaleString()}</span>
            </div>
            {documentationIncluded && (
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1 text-[#15803d] font-medium text-xs">
                  <span className="w-1 h-1 rounded-full bg-[#15803d]"></span>
                  Documentation included
                </span>
                <span className="text-[#15803d] font-medium">₹0</span>
              </div>
            )}
            {hasDiscount && discountAmount && discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#736E66]">Discount</span>
                <span className="text-[#B45309] font-medium">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            {gst && gst > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#736E66]">GST / Taxes</span>
                <span className="text-[#141414] font-medium">₹{gst.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t border-[#E3DDD4] pt-3">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[#736E66] text-sm uppercase tracking-wider font-semibold">
                Order total
              </span>
              <span className="text-2xl font-bold text-[#141414]">
                ₹{orderTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Trust list */}
          <div className="border-t border-[#F0EAE1] pt-4 space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#736E66]">
              What you get
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-sm">
                <Package className="w-4 h-4 text-[#15803d] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#141414] font-medium leading-tight">
                    Source code + documentation delivered
                  </p>
                  <p className="text-[10px] text-[#736E66]">
                    Delivered instantly after verification
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#15803d] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#141414] font-medium leading-tight">
                    Secure payment
                  </p>
                  <p className="text-[10px] text-[#736E66]">
                    UPI, cards & net banking protected
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <HelpCircle className="w-4 h-4 text-[#15803d] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#141414] font-medium leading-tight">
                    Support after delivery
                  </p>
                  <p className="text-[10px] text-[#736E66]">
                    Help with setup & questions
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t border-[#F0EAE1] pt-4">
            <button
              onClick={onContact}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#736E66] hover:text-[#141414] transition-colors"
              aria-label="Contact us for help"
            >
              <HelpCircle className="w-3 h-3" />
              Need help? Contact us
            </button>
          </div>
        </div>
      </div>

      {/* Mobile collapsible header */}
      <div className="lg:hidden mt-4 bg-white border border-[#E3DDD4] rounded-lg p-3">
        <button
          className="flex items-center justify-between w-full"
          aria-expanded={false}
          aria-controls="order-summary-mobile"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#141414] uppercase tracking-wider">
              Order summary
            </span>
            <span className="text-xs font-bold text-[#141414]">₹{orderTotal.toLocaleString()}</span>
          </div>
          <svg className="w-4 h-4 text-[#141414]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
    </div>
  )
}