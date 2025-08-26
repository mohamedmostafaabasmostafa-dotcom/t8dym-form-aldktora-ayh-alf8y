import { Check } from "lucide-react";
import type { RegistrationStep } from "@/pages/registration";

interface ProgressStepsProps {
  currentStep: RegistrationStep;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { number: 1, label: "اختيار الصف" },
    { number: 2, label: "بيانات الطالب" },
    { number: 3, label: "تأكيد التسجيل" },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (currentStep === "success") return "completed";
    if (typeof currentStep === "number") {
      if (stepNumber < currentStep) return "completed";
      if (stepNumber === currentStep) return "active";
    }
    return "inactive";
  };

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const status = getStepStatus(step.number);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`
                  step-indicator flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                  ${status === "completed" 
                    ? "bg-secondary text-white" 
                    : status === "active"
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                  }
                `}
                data-testid={`step-indicator-${step.number}`}
              >
                {status === "completed" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  mr-3 text-sm font-medium
                  ${status === "completed" 
                    ? "text-secondary" 
                    : status === "active"
                    ? "text-primary"
                    : "text-gray-500"
                  }
                `}
                data-testid={`step-label-${step.number}`}
              >
                {step.label}
              </span>
            </div>
            
            {!isLast && (
              <div
                className={`
                  w-8 h-0.5 mx-4
                  ${status === "completed" ? "bg-secondary" : "bg-gray-300"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
