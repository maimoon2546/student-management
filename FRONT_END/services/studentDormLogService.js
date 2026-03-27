const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createStudentDormLog(payload) {
  const res = await fetch(`${API_URL}/api/student_dorm_log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'ลงทะเบียนเข้าหอพักไม่สำเร็จ');
  }

  return res.json();
}


export async function transferDorm(payload) {
  const res = await fetch(`${API_URL}/api/dorm_transfer`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}