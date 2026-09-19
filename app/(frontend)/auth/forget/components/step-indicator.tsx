import React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
}

const steps = [
  { number: 1, label: "Email" },
  { number: 2, label: "Verify" },
  { number: 3, label: "Reset" },
  { number: 4, label: "Done" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="flex w-full max-w-xs items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep || currentStep === 4
          const isActive = step.number === currentStep && currentStep !== 4
          const isUpcoming = step.number > currentStep

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isUpcoming && "border border-input bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckIcon className="size-4" /> : step.number}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-tight",
                    isActive && "text-primary font-semibold",
                    isCompleted && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "mb-4 h-0.5 flex-1 transition-all duration-300",
                    step.number < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
