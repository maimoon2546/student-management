//สร้าง API เพื่อดึงข้อมูลนักเรียนตามรหัสนักเรียน
import pool from '@/lib/db';

export async function GET(req, context) {
  const { student_code } = await context.params;

  try {
    const [rows] = await pool.query(
      `SELECT student_code, title, first_name, last_name, gender, birth_date, 
       path, qr_code, parent_id, relationship, status
       FROM students
       WHERE student_code = ?`,
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
