import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { student_code } = params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        s.student_code,
        s.first_name,
        s.last_name,
        s.dorm_status,
        d.dorm_name,
        r.room_number
      FROM student_dorm_log l
      JOIN students s ON s.student_code = l.student_code
      JOIN rooms r ON r.room_id = l.room_id
      JOIN dorms d ON d.dorm_id = r.dorm_id
      WHERE l.student_code = ?
      AND l.check_out_date IS NULL
      LIMIT 1
      `,
      [student_code]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "ไม่พบนักเรียนที่อยู่ในหอ" },
        { status: 404 }
      );
    }

    return Response.json(rows[0]);

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Database error" },
      { status: 500 }
    );
  }
}