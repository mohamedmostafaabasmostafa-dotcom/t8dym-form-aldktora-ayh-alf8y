import { google } from 'googleapis';

interface StudentData {
  grade: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  schoolName: string;
  createdAt: string;
}

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = '1mlDo90S2O-YAQpKzUlukNf6q0J3-iRTfx4Zwk0Tj22g';
  }

  async addStudent(studentData: StudentData): Promise<void> {
    try {
      const gradeNames = {
        '1': 'الأول الثانوي',
        '2': 'الثاني الثانوي',
        '3': 'الثالث الثانوي'
      };

      // Prepare row data
      const values = [
        [
          new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
          gradeNames[studentData.grade as keyof typeof gradeNames],
          studentData.studentName,
          studentData.studentPhone,
          studentData.parentPhone,
          studentData.schoolName
        ]
      ];

      // Add header row if sheet is empty
      await this.ensureHeaderExists();

      // Append the student data
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'RAW',
        resource: {
          values: values
        }
      });

      console.log('Student data successfully added to Google Sheets');
    } catch (error) {
      console.error('Error adding student to Google Sheets:', error);
      throw new Error('فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.');
    }
  }

  private async ensureHeaderExists(): Promise<void> {
    try {
      // Check if header exists
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:F1'
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add header row
        const headerValues = [
          ['تاريخ التسجيل', 'الصف الدراسي', 'اسم الطالب', 'رقم هاتف الطالب', 'رقم هاتف ولي الأمر', 'اسم المدرسة']
        ];

        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'RAW',
          resource: {
            values: headerValues
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring header exists:', error);
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
