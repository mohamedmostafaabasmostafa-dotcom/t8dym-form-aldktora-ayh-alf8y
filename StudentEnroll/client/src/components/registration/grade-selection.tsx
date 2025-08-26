import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface GradeSelectionProps {
  onGradeSelect: (grade: string) => void;
}

const gradeOptions = [
  {
    grade: "1",
    title: "الأول الثانوي",
    description: "الصف الأول من المرحلة الثانوية",
    emoji: "📚",
  },
  {
    grade: "2", 
    title: "الثاني الثانوي",
    description: "الصف الثاني من المرحلة الثانوية",
    emoji: "📖",
  },
  {
    grade: "3",
    title: "الثالث الثانوي", 
    description: "الصف الثالث من المرحلة الثانوية",
    emoji: "🎓",
  },
];

export default function GradeSelection({ onGradeSelect }: GradeSelectionProps) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const handleGradeClick = (grade: string) => {
    setSelectedGrade(grade);
    
    // Auto-advance after selection with a small delay
    setTimeout(() => {
      onGradeSelect(grade);
    }, 500);
  };

  return (
    <div className="step-content" data-testid="grade-selection">
      <div className="text-center mb-8">
        <GraduationCap className="mx-auto h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر الصف الدراسي</h2>
        <p className="text-gray-600">يرجى اختيار الصف الدراسي المناسب للطالب</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {gradeOptions.map((option) => (
          <Card
            key={option.grade}
            className={`
              grade-option border-2 p-6 text-center cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedGrade === option.grade
                ? "border-primary bg-blue-50"
                : "border-gray-200 hover:border-primary"
              }
            `}
            onClick={() => handleGradeClick(option.grade)}
            data-testid={`grade-option-${option.grade}`}
          >
            <div className="text-4xl mb-4">{option.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
