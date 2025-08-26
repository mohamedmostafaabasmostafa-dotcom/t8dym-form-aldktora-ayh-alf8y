import { type Student, type InsertStudent, type AdminSession, type InsertAdminSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(sessionToken: string): Promise<AdminSession | undefined>;
  deleteAdminSession(sessionToken: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;

  constructor() {
    this.students = new Map();
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { 
      ...insertStudent, 
      id,
      createdAt: new Date()
    };
    this.students.set(id, student);
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  // Admin sessions
  private adminSessions: Map<string, AdminSession> = new Map();

  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    const id = randomUUID();
    const session: AdminSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.adminSessions.set(session.sessionToken, session);
    return session;
  }

  async getAdminSession(sessionToken: string): Promise<AdminSession | undefined> {
    const session = this.adminSessions.get(sessionToken);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session && session.expiresAt <= new Date()) {
      this.adminSessions.delete(sessionToken);
    }
    return undefined;
  }

  async deleteAdminSession(sessionToken: string): Promise<void> {
    this.adminSessions.delete(sessionToken);
  }
}

export const storage = new MemStorage();
