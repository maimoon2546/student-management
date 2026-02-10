// services/studentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStudentByCode(student_code) {
  const res = await fetch(
    `${API_URL}/api/school_students/${student_code}`
  );

  if (!res.ok) {
    throw new Error("Student not found");
  }

  return res.json();
}



// ✅ เพิ่มฟังก์ชันนี้
export async function updateStudent(student_code, payload) {
  const res = await fetch(`${API_URL}/api/students/${student_code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'อัปเดตไม่สำเร็จ');
  }

  return res.json();
}

// ดึงรายชื่อนักเรียนทั้งหมด
export async function getAllStudents() {
  const res = await fetch(`${API_URL}/api/school_students`);
  if (!res.ok) throw new Error('โหลดรายชื่อนักเรียนไม่สำเร็จ');
  return res.json();
}
