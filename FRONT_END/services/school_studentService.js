// services/school_studentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   CREATE SCHOOL STUDENT
========================= */
export async function createSchoolStudent(payload) {
  const res = await fetch(`${API_URL}/api/school_students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'บันทึกไม่สำเร็จ');
  }

  return res.json();
}

/* =========================
   GET SCHOOL STUDENT
========================= */
export async function getSchoolStudent(student_code) {
  const res = await fetch(`${API_URL}/api/school_students/${student_code}`);
  if (!res.ok) throw new Error('ไม่พบนักเรียน');
  return res.json();
}

/* =========================
   UPDATE SCHOOL STUDENT
========================= */
export async function updateSchoolStudent(student_code, payload) {
  const res = await fetch(`${API_URL}/api/school_students/${student_code}`, {
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

/* =========================
   GENERATE STUDENT CODE
========================= */
export async function generateStudentCode() {
  const res = await fetch(`${API_URL}/api/students/next-code`);
  if (!res.ok) throw new Error('ไม่สามารถสร้างรหัสได้');
  return res.json();
}

// ดึงรายชื่อทั้งหมด
export async function getAllStudents() {
  const res = await fetch(`${API_URL}/api/students`);
  if (!res.ok) throw new Error('โหลดรายชื่อนักเรียนไม่สำเร็จ');
  return res.json();
}

// ค้นหานักเรียนตามรหัส
export async function getStudentByCode(student_code) {
  const res = await fetch(`${API_URL}/api/students/${student_code}`);
  if (!res.ok) throw new Error('ไม่พบนักเรียน');
  return res.json();
}

export async function getSchoolStudentByCode(student_code) {
  const res = await fetch(`${API_URL}/api/school_students/${student_code}`);
  if (!res.ok) {
    throw new Error('ไม่พบนักเรียน');
  }

  return res.json();
}

