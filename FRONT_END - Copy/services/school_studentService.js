// services/studentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createSchool_Student(data) {
  const res = await fetch(`${API_URL}/api/school_students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });


  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function getSchoolStudent(studentCode) {
  const res = await fetch(
    `${API_URL}/api/school_students/${studentCode}`
  );

  if (!res.ok) {
    throw new Error('ไม่พบนักเรียน');
  }

  return res.json();
}

export default async function AddStudentPage() {
  const res = await fetch(
    `${API_URL}/api/students/create`
  );
  
  const data = await res.json();
  if (data.success) {
    setResult(data.student_code);
  }
}
