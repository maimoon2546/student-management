// ================= LOGIN =================
export const login = async (username, password, role, student_code) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      role,
      student_code
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

// ================= REGISTER =================
export const register = async ({
  username,
  email,
  password,
  first_name,
  last_name,
  role,
  student_code
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,      // ใช้เฉพาะ staff
      email,         // ใช้เฉพาะ parent
      password,
      first_name,
      last_name,
      role,
      student_code
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};