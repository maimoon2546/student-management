import QRClient from './StudentQR';

export default async function StudentPage({ params }) {
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
    <>
      <h1>ข้อมูลนักเรียน</h1>

      <p><b>รหัสนักเรียน:</b> {student.student_code}</p>
      <p><b>ชื่อ:</b> {student.first_name} {student.last_name}</p>

      <QRClient studentCode={student.student_code} />

      {/* ปุ่มเช็กอิน */}
      <button>✅ เช็กอิน</button>

      {/* ปุ่มเช็กเอาต์ */}
      <button>🚪 เช็กเอาต์</button>

      <hr />

      {/* ปุ่มจัดการข้อมูล (staff) */}
      <button>⚙️ จัดการข้อมูลนักเรียน</button>
    </>
  );
}
