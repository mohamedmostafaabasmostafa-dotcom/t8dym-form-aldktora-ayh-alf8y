import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Edit, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { StudentData } from "@/pages/registration";

interface ConfirmationProps {
  studentData: StudentData;
  onConfirm: () => void;
  onBack: () => void;
}

const gradeNames = {
  "1": "الأول الثانوي",
  "2": "الثاني الثانوي",
  "3": "الثالث الثانوي",
};

export default function Confirmation({ studentData, onConfirm, onBack }: ConfirmationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: StudentData) => {
      const response = await apiRequest("POST", "/api/students", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم حفظ بيانات الطالب بنجاح في النظام",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      onConfirm();
    },
    onError: (error: any) => {
      toast({
        title: "حدث خطأ في التسجيل",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    mutation.mutate(studentData);
  };

  return (
    <div className="step-content" data-testid="confirmation">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-secondary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تأكيد البيانات</h2>
        <p className="text-gray-600">يرجى مراجعة البيانات قبل التأكيد النهائي</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Data Summary */}
        <Card className="bg-gray-50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص البيانات:</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الصف الدراسي:</span>
              <span className="font-medium text-gray-900" data-testid="confirm-grade">
                {gradeNames[studentData.grade as keyof typeof gradeNames]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">اسم الطالب:</span>
              <span className="font-medium text-gray-900" data-testid="confirm-student-name">
                {studentData.studentName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">رقم هاتف الطالب:</span>
              <span className="font-medium text-gray-900" data-testid="confirm-student-phone">
                {studentData.studentPhone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">رقم هاتف ولي الأمر:</span>
              <span className="font-medium text-gray-900" data-testid="confirm-parent-phone">
                {studentData.parentPhone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">اسم المدرسة:</span>
              <span className="font-medium text-gray-900" data-testid="confirm-school-name">
                {studentData.schoolName}
              </span>
            </div>
          </div>
        </Card>

        {/* Final Submission */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={mutation.isPending}
            data-testid="button-back-to-form"
          >
            <Edit className="h-4 w-4 ml-2" />
            تعديل البيانات
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-secondary hover:bg-secondary/90"
            data-testid="button-final-submit"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري التسجيل...
              </>
            ) : (
              <>
                تأكيد التسجيل
                <Check className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
