// app/layout.js
import './globals.css';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'student_management ',
  description: 'ระบบจัดการข้อมูลนักเรียนปอเนาะ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  );
}
