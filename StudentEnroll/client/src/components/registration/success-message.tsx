import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Plus } from "lucide-react";

interface SuccessMessageProps {
  onRegisterAnother: () => void;
}

export default function SuccessMessage({ onRegisterAnother }: SuccessMessageProps) {
  return (
    <div className="step-content text-center" data-testid="success-message">
      <CheckCircle className="mx-auto h-20 w-20 text-secondary mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">تم التسجيل بنجاح!</h2>
      <p className="text-gray-600 mb-6 text-lg">تم حفظ بيانات الطالب بنجاح في النظام</p>
      
      <Card className="bg-green-50 border border-green-200 p-4 mb-6 max-w-md mx-auto">
        <p className="text-secondary font-medium">
          سيتم التواصل معكم قريباً لاستكمال باقي إجراءات التسجيل
        </p>
      </Card>
      
      <Button
        type="button"
        onClick={onRegisterAnother}
        data-testid="button-register-another"
      >
        تسجيل طالب آخر
        <Plus className="h-4 w-4 mr-2" />
      </Button>
    </div>
  );
}
