import pool from '@/lib/db';

export async function GET(req, context) {
  const { student_code } = await context.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        s.student_code,
        s.title,
        s.first_name,
        s.last_name,
        s.gender,
        s.birth_date,
        s.dorm_status,
        r.room_id,
        r.room_number,
        r.dorm_id,
        d.dorm_name
      FROM students s
      LEFT JOIN student_dorm_log l 
        ON s.student_code = l.student_code
        AND l.check_out_date IS NULL
      LEFT JOIN rooms r
        ON l.room_id = r.room_id
      LEFT JOIN dorms d
        ON r.dorm_id = d.dorm_id
      WHERE s.student_code = ?
      ORDER BY l.check_in_date DESC
      LIMIT 1
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

export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    const {
      title,
      first_name,
      last_name,
      gender,
      birth_date
    } = body;

    const student_code = params.student_code;

    await pool.execute(
      `
      UPDATE students
      SET
        title = ?,
        first_name = ?,
        last_name = ?,
        gender = ?,
        birth_date = ?
      WHERE student_code = ?
      `,
      [title, first_name, last_name, gender, birth_date, student_code]
    );

    return Response.json({
      message: "อัปเดตข้อมูลสำเร็จ",
      student_code
    });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "อัปเดตข้อมูลไม่สำเร็จ" }),
      { status: 500 }
    );
  }
}