// auth/login/route.js
import db from '@/lib/db';

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const [rows] = await db.execute(
      `SELECT 
        staff_id,
        username,
        first_name,
        last_name,
        role
      FROM staff
      WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Username หรือ Password ไม่ถูกต้อง' }),
        {
          status: 401,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    const staff = rows[0];

    const response = new Response(
      JSON.stringify({
        message: 'Login success',
        user: staff,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': `staff_id=${staff.staff_id}; Path=/; HttpOnly; SameSite=Lax`
        }
      }
    );

    return response;

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}
