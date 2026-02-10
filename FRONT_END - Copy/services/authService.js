// services/authService.js
export async function login(username, password) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
}
