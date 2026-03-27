// app/students/[student_code]/page.js
import QRClient from './StudentQR';
import '@/styles/students-page.css';
import { IdCard } from "lucide-react";

export default async function StudentPage({ params }) {
  const { student_code } = await params;

  // ตรวจสอบข้อมูลเบื้องต้นแบบ Server Component
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${student_code}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <div className="student-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>ไม่พบข้อมูลนักเรียน</h2>
          <p>ไม่พบข้อมูลนักเรียนรหัส {student_code}</p>
          <a href="/" className="back-button">
            <span>←</span>
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  const student = await res.json();

  return (
    <div className="student-page">
      <div className="page-container">
        
        {/* Header */}
        <div className="page-header">
          <div className="header-icon">
            <IdCard size={32} />
          </div>
          <div className="header-content">
            <h1 className="page-title">บัตรประจำตัวนักเรียน</h1>
            <p className="page-subtitle">Student ID Card</p>
          </div>
        </div>

        {/* บัตรประจำตัวที่สร้างจาก Component */}
        <div className="card-section">
          <QRClient studentCode={student.student_code} />
        </div>


        {/* คำเตือน/ข้อแนะนำ */}
        <div className="page-footer">
          <p className="footer-text">
            ให้นักเรียนแสดงบัตรนี้เพื่อสแกน QR Code ที่ผู้ดูแลหอพัก
          </p>
        </div>

      </div>
    </div>
  );
}