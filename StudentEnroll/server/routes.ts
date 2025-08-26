import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema } from "@shared/schema";
import { googleSheetsService } from "./services/google-sheets";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student registration endpoint
  app.post("/api/students", async (req, res) => {
    try {
      // Validate request body
      const result = insertStudentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          message: "بيانات غير صحيحة",
          errors: result.error.errors
        });
      }

      // Save to local storage
      const student = await storage.createStudent(result.data);

      // Save to Google Sheets
      try {
        await googleSheetsService.addStudent({
          ...result.data,
          createdAt: student.createdAt.toISOString()
        });
      } catch (sheetsError) {
        console.error("Google Sheets error:", sheetsError);
        // Continue even if Google Sheets fails, but log the error
      }

      res.status(201).json({
        message: "تم التسجيل بنجاح",
        student: {
          id: student.id,
          grade: student.grade,
          studentName: student.studentName,
          createdAt: student.createdAt
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "حدث خطأ في النظام. يرجى المحاولة مرة أخرى."
      });
    }
  });

  // Get all students (optional endpoint for admin)
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({
        message: "حدث خطأ في جلب البيانات"
      });
    }
  });

  // Admin authentication middleware
  const authenticateAdmin = async (req: Request & { adminSession?: any }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const session = await storage.getAdminSession(token);
    
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    req.adminSession = session;
    next();
  };

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Simple password check (in production, use proper hashing)
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
      }

      // Create session
      const sessionToken = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const session = await storage.createAdminSession({
        sessionToken,
        expiresAt,
      });

      res.json({
        message: "تم تسجيل الدخول بنجاح",
        sessionToken: session.sessionToken,
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "حدث خطأ في النظام" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", authenticateAdmin, async (req: Request & { adminSession?: any }, res) => {
    try {
      await storage.deleteAdminSession(req.adminSession.sessionToken);
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "حدث خطأ في النظام" });
    }
  });

  // Admin get all students endpoint
  app.get("/api/admin/students", authenticateAdmin, async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      // Sort by creation date, newest first
      const sortedStudents = students.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json(sortedStudents);
    } catch (error) {
      console.error("Error fetching students for admin:", error);
      res.status(500).json({ message: "حدث خطأ في جلب البيانات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
