import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Search, Users, Calendar, School, Phone, User, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Student } from "@shared/schema";

const gradeNames = {
  "1": "الأول الثانوي",
  "2": "الثاني الثانوي",
  "3": "الثالث الثانوي",
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin");
      return;
    }
  }, [setLocation]);

  const { data: students, isLoading, error } = useQuery({
    queryKey: ["/api/admin/students"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/students", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          setLocation("/admin");
          throw new Error("انتهت صلاحية الجلسة");
        }
        throw new Error("فشل في جلب البيانات");
      }
      return response.json();
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("adminToken");
      await apiRequest("POST", "/api/admin/logout", {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    },
    onSettled: () => {
      localStorage.removeItem("adminToken");
      setLocation("/admin");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const exportToCSV = () => {
    if (!students || students.length === 0) {
      toast({
        title: "لا توجد بيانات للتصدير",
        variant: "destructive",
      });
      return;
    }

    const headers = ["التاريخ", "الصف", "اسم الطالب", "هاتف الطالب", "هاتف ولي الأمر", "المدرسة"];
    const csvContent = [
      headers.join(","),
      ...students.map((student: Student) => [
        new Date(student.createdAt).toLocaleDateString("ar-EG"),
        gradeNames[student.grade as keyof typeof gradeNames],
        `"${student.studentName}"`,
        student.studentPhone,
        student.parentPhone,
        `"${student.schoolName}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم تصدير البيانات بنجاح",
      description: "تم تحميل ملف CSV",
    });
  };

  const filteredStudents = students?.filter((student: Student) =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentPhone.includes(searchTerm) ||
    student.parentPhone.includes(searchTerm)
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="p-8 text-center">
          <p className="text-destructive">حدث خطأ في جلب البيانات</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-gray-600">إدارة تسجيلات الطلاب</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary ml-3" />
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="total-students">
                  {students?.length || 0}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-secondary ml-3" />
              <div>
                <p className="text-sm text-gray-600">تسجيلات اليوم</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="today-registrations">
                  {students?.filter((s: Student) => 
                    new Date(s.createdAt).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <School className="h-8 w-8 text-orange ml-3" />
              <div>
                <p className="text-sm text-gray-600">عدد المدارس</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="unique-schools">
                  {new Set(students?.map((s: Student) => s.schoolName)).size || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث في الطلاب (الاسم، المدرسة، الهاتف...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                data-testid="search-students"
              />
            </div>
            <Button 
              onClick={exportToCSV}
              variant="outline"
              disabled={!students || students.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير CSV
            </Button>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : !filteredStudents || filteredStudents.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد تسجيلات حتى الآن"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الصف</TableHead>
                    <TableHead className="text-right">اسم الطالب</TableHead>
                    <TableHead className="text-right">هاتف الطالب</TableHead>
                    <TableHead className="text-right">هاتف ولي الأمر</TableHead>
                    <TableHead className="text-right">المدرسة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: Student) => (
                    <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 ml-2" />
                          {new Date(student.createdAt).toLocaleDateString("ar-EG")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" data-testid={`grade-${student.grade}`}>
                          {gradeNames[student.grade as keyof typeof gradeNames]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="font-medium">{student.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 ml-2" />
                          {student.studentPhone}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 ml-2" />
                          {student.parentPhone}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <School className="h-4 w-4 text-gray-400 ml-2" />
                          {student.schoolName}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}