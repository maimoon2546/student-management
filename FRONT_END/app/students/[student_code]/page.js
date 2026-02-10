// app/students/[student_code]/page.js
import QRClient from './StudentQR';

export default async function StudentPage({ params }) {
  const { student_code } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students/${student_code}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <p>❌ ไม่พบข้อมูลนักเรียน</p>;
  }

  const student = await res.json();

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h1>🎓 บัตรประจำตัวนักเรียน</h1>

      <p><b>รหัสนักเรียน:</b> {student.student_code}</p>
      <p>
        <b>ชื่อ:</b> {student.title}
        {student.first_name} {student.last_name}
      </p>

      {/* สร้าง / แสดง QR */}
      <QRClient studentCode={student.student_code} />
    </div>
  );
}
