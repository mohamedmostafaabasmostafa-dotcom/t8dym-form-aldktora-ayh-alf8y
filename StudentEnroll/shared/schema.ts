import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, relations } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  grade: varchar("grade", { length: 1 }).notNull(), // "1", "2", "3"
  studentName: text("student_name").notNull(),
  studentPhone: varchar("student_phone", { length: 11 }).notNull(),
  parentPhone: varchar("parent_phone", { length: 11 }).notNull(),
  schoolName: text("school_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Egyptian phone number validation
const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

export const insertStudentSchema = createInsertSchema(students)
  .omit({ id: true, createdAt: true })
  .extend({
    studentName: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين").max(100, "الاسم طويل جداً"),
    studentPhone: z.string().regex(egyptianPhoneRegex, "يرجى إدخال رقم هاتف صحيح (01xxxxxxxxx)"),
    parentPhone: z.string().regex(egyptianPhoneRegex, "يرجى إدخال رقم هاتف صحيح (01xxxxxxxxx)"),
    schoolName: z.string().min(2, "يجب أن يكون اسم المدرسة على الأقل حرفين").max(100, "اسم المدرسة طويل جداً"),
    grade: z.enum(["1", "2", "3"], { required_error: "يرجى اختيار الصف الدراسي" }),
  });

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Admin sessions table for simple password-based authentication
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
