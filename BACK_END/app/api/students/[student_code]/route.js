// app/api/students/[student_code]/route.js 
import pool from '@/lib/db';

// GET /api/students/:student_code
export async function GET(req, { params }) {
  const { student_code } = await params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        student_code,
        title,
        first_name,
        last_name,
        gender,
        birth_date,
        status,
        qr_code,
        path
      FROM students
      WHERE student_code = ?
      `,
      [student_code]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: 'ไม่พบนักเรียน' },
        { status: 404 }
      );
    }

    return Response.json(rows[0]);

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'Database error' },
      { status: 500 }
    );
  }
}
