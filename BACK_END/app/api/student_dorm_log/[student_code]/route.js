import pool from '@/lib/db';

export async function GET(req, { params }) {
  const { student_code } = params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        s.student_code,
        s.first_name,
        s.last_name,
        d.room_id,
        r.room_number,
        r.dorm_id
      FROM student_dorm_log d
      JOIN students s ON s.student_code = d.student_code
      JOIN rooms r ON r.room_id = d.room_id
      WHERE d.student_code = ?
      AND d.check_out_date IS NULL
      `,
      [student_code]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "นักเรียนไม่ได้พักอยู่ในหอพัก" },
        { status: 404 }
      );
    }

    return Response.json(rows[0]);

  } catch (err) {
    return Response.json(
      { message: "Database error" },
      { status: 500 }
    );
  }
}