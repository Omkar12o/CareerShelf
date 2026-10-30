import { CheckCircle, Circle, Loader2, ArrowRight } from 'lucide-react'

type StepStatus = 'pending' | 'current' | 'completed'

interface StepperStep {
  id: number
  label: string
  status: StepStatus
}

export interface CheckoutStepperProps {
  steps: StepperStep[]
  currentStep: number
}

export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <div className="w-full space-y-3">
      <div className="relative flex items-center space-x-2">
        <div className="hidden lg:flex w-full h-[1px] bg-[#DDD5C7] z-0" />
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`flex items-center space-x-2 relative z-10 ${
              step.status === 'completed' || step.status === 'current'
                ? 'space-x-1'
                : ''
            }`}
          >
            <div className="relative z-20">
              {step.status === 'current' ? (
                <div className="w-7 h-7 rounded-full bg-[#141414] flex items-center justify-center text-white">
                  <div className="w-3 h-3 rounded-full animate-pulse bg-[#141414]" />
                </div>
              ) : step.status === 'completed' ? (
                <div className="w-7 h-7 rounded-full border-2 border-[#141414] flex items-center justify-center text-[#141414]">
                  <CheckCircle className="w-3 h-3 fill-[#141414]" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border border-[#DDD5C7] flex items-center justify-center text-[#736E66] text-xs">
                  {step.id}
                </div>
              )}
            </div>
            <span className={`font-medium text-sm ${
              step.status === 'current'
                ? 'text-[#141414]'
                : step.status === 'completed'
                  ? 'text-[#403D37]'
                  : 'text-[#736E66]'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DefaultCheckoutStepper(currentStep: number) {
  const steps: StepperStep[] = [
    { id: 1, label: 'Select option', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending' },
    { id: 2, label: 'Payment', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending' },
    { id: 3, label: 'Verify', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending' },
  ]

  return <CheckoutStepper steps={steps} currentStep={currentStep} />
}