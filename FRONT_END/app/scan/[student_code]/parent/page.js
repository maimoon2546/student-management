import HistoryTable from './HistoryTable';
import ParentMessageBox from './ParentMessageBox';
import '@/styles/scan.css';

export default async function ParentScanPage({ params }) {
  const { student_code } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students/${student_code}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <p>ไม่พบข้อมูลนักเรียน</p>;
  }

  const student = await res.json();

  return (
    <div className="scan-container">
      <div className="scan-card">

        <h2>👨‍👩‍👧 ข้อมูลนักเรียน</h2>

        <p>รหัส: {student.student_code}</p>
        <p>ชื่อ: {student.first_name} {student.last_name}</p>

        {/* ดูประวัติ */}
       <HistoryTable studentCode={student.student_code} />

        {/* ฝากข้อความ */}
        <ParentMessageBox studentCode={student.student_code} />

        <a href="/dashboard" className="back-link">← กลับ</a>
        
      </div>
    </div>
  );
}
