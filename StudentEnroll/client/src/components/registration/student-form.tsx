import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Info, Phone, School, User } from "lucide-react";
import { insertStudentSchema, type InsertStudent } from "@shared/schema";
import { z } from "zod";

interface StudentFormProps {
  selectedGrade: string;
  onSubmit: (data: Omit<InsertStudent, "grade">) => void;
  onBack: () => void;
}

const formSchema = insertStudentSchema.omit({ grade: true });
type FormData = z.infer<typeof formSchema>;

const gradeNames = {
  "1": "الأول الثانوي",
  "2": "الثاني الثانوي", 
  "3": "الثالث الثانوي",
};

export default function StudentForm({ selectedGrade, onSubmit, onBack }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <div className="step-content" data-testid="student-form">
      <div className="text-center mb-8">
        <User className="mx-auto h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">بيانات الطالب</h2>
        <p className="text-gray-600">يرجى إدخال جميع البيانات المطلوبة بدقة</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-2xl mx-auto space-y-6">
        {/* Selected Grade Display */}
        <Card className="bg-blue-50 border border-blue-200 p-4 mb-6">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-primary ml-2" />
            <span className="text-primary font-medium">الصف المختار: </span>
            <span className="font-semibold text-gray-900" data-testid="selected-grade-display">
              {gradeNames[selectedGrade as keyof typeof gradeNames]}
            </span>
          </div>
        </Card>

        {/* Student Name */}
        <div className="form-group">
          <Label htmlFor="studentName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 ml-2 text-primary" />
            اسم الطالب كاملاً
          </Label>
          <Input
            {...register("studentName")}
            id="studentName"
            type="text"
            placeholder="أدخل اسم الطالب الكامل"
            className={`w-full ${errors.studentName ? "border-destructive" : ""}`}
            data-testid="input-student-name"
          />
          {errors.studentName && (
            <p className="text-destructive text-sm mt-1" data-testid="error-student-name">
              {errors.studentName.message}
            </p>
          )}
        </div>

        {/* Student Phone */}
        <div className="form-group">
          <Label htmlFor="studentPhone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 ml-2 text-primary" />
            رقم هاتف الطالب
          </Label>
          <Input
            {...register("studentPhone")}
            id="studentPhone"
            type="tel"
            placeholder="01xxxxxxxxx"
            className={`w-full ${errors.studentPhone ? "border-destructive" : ""}`}
            data-testid="input-student-phone"
          />
          {errors.studentPhone && (
            <p className="text-destructive text-sm mt-1" data-testid="error-student-phone">
              {errors.studentPhone.message}
            </p>
          )}
        </div>

        {/* Parent Phone */}
        <div className="form-group">
          <Label htmlFor="parentPhone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 ml-2 text-primary" />
            رقم هاتف ولي الأمر
          </Label>
          <Input
            {...register("parentPhone")}
            id="parentPhone"
            type="tel"
            placeholder="01xxxxxxxxx"
            className={`w-full ${errors.parentPhone ? "border-destructive" : ""}`}
            data-testid="input-parent-phone"
          />
          {errors.parentPhone && (
            <p className="text-destructive text-sm mt-1" data-testid="error-parent-phone">
              {errors.parentPhone.message}
            </p>
          )}
        </div>

        {/* School Name */}
        <div className="form-group">
          <Label htmlFor="schoolName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <School className="h-4 w-4 ml-2 text-primary" />
            اسم المدرسة
          </Label>
          <Input
            {...register("schoolName")}
            id="schoolName"
            type="text"
            placeholder="أدخل اسم المدرسة"
            className={`w-full ${errors.schoolName ? "border-destructive" : ""}`}
            data-testid="input-school-name"
          />
          {errors.schoolName && (
            <p className="text-destructive text-sm mt-1" data-testid="error-school-name">
              {errors.schoolName.message}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            data-testid="button-back-to-grade"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit-form"
          >
            متابعة
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
