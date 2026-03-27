import db from '@/lib/db';
import bcrypt from 'bcryptjs';

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
    const { username, password, role, student_code } = await request.json();
   console.log("LOGIN DATA:", { username, role });
   
    let query = '';
    let params = [];

    // =====================
    // STAFF LOGIN
    // =====================
    if (role === 'staff') {
      query = `
        SELECT 
          staff_id AS id,
          username,
          password,
          first_name,
          last_name,
          role
        FROM staff
        WHERE username = ?
      `;
      params = [username];
    }

    // =====================
    // PARENT LOGIN
    // =====================
    else {
      query = `
        SELECT 
          parent_id AS id,
          email,
          password,
          first_name,
          last_name
        FROM parents
        WHERE email = ?
      `;
      params = [username];
    }

    const [rows] = await db.execute(query, params);
    console.log("DB USER:", rows);

    if (rows.length === 0) {
      return Response.json(
        { message: 'Email หรือ Password ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return Response.json(
        { message: 'Email หรือ Password ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // ตรวจสิทธิ์ parent ดูนักเรียน
    if (role !== 'staff' && student_code) {
      const [student] = await db.execute(
        `
        SELECT student_code
        FROM students
        WHERE student_code = ?
        AND parent_id = ?
        `,
        [student_code, user.id]
      );

      if (student.length === 0) {
        return Response.json(
          { message: 'คุณไม่มีสิทธิ์เข้าถึงนักเรียนคนนี้' },
          { status: 403 }
        );
      }
    }

    delete user.password;

    return Response.json({
      message: 'Login success',
      user,
      role: role === 'staff' ? 'staff' : 'parent'
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}