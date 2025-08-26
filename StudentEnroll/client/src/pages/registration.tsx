import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import ProgressSteps from "@/components/registration/progress-steps";
import GradeSelection from "@/components/registration/grade-selection";
import StudentForm from "@/components/registration/student-form";
import Confirmation from "@/components/registration/confirmation";
import SuccessMessage from "@/components/registration/success-message";
import type { InsertStudent } from "@shared/schema";

export type RegistrationStep = 1 | 2 | 3 | "success";

export interface StudentData {
  grade: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  schoolName: string;
}

export default function Registration() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [studentData, setStudentData] = useState<Partial<StudentData>>({});

  const handleGradeSelect = (grade: string) => {
    setStudentData({ ...studentData, grade });
    setCurrentStep(2);
  };

  const handleStudentFormSubmit = (data: Omit<InsertStudent, "grade">) => {
    setStudentData({ ...studentData, ...data });
    setCurrentStep(3);
  };

  const handleConfirmSubmit = () => {
    setCurrentStep("success");
  };

  const handleReset = () => {
    setStudentData({});
    setCurrentStep(1);
  };

  const handleBackToStep = (step: RegistrationStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="bg-background min-h-screen font-arabic">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="h-8 w-8 text-primary ml-3" />
              <h1 className="text-3xl font-bold text-gray-900">تسجيل الطلاب</h1>
            </div>
            <p className="text-gray-600">المرحلة الثانوية - العام الدراسي 2024/2025</p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressSteps currentStep={currentStep} />

        {/* Main Content */}
        <Card className="bg-surface shadow-lg p-8 mt-8">
          {currentStep === 1 && (
            <GradeSelection onGradeSelect={handleGradeSelect} />
          )}
          
          {currentStep === 2 && (
            <StudentForm
              selectedGrade={studentData.grade!}
              onSubmit={handleStudentFormSubmit}
              onBack={() => handleBackToStep(1)}
            />
          )}
          
          {currentStep === 3 && (
            <Confirmation
              studentData={studentData as StudentData}
              onConfirm={handleConfirmSubmit}
              onBack={() => handleBackToStep(2)}
            />
          )}
          
          {currentStep === "success" && (
            <SuccessMessage onRegisterAnother={handleReset} />
          )}
        </Card>
      </div>
    </div>
  );
}
