// services/studentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createStudent(data) {
  const res = await fetch(`${API_URL}/api/students`, {
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