import { createWithParent } from '@/controllers/school_studentsController';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createWithParent(body);

    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT
        s.student_code,
        s.title,
        s.first_name,
        s.last_name,
        s.gender,
        s.birth_date,
        s.dorm_status,
        r.room_number,
        d.dorm_name
      FROM students s
      LEFT JOIN student_dorm_log l
        ON s.student_code = l.student_code
        AND l.check_out_date IS NULL
      LEFT JOIN rooms r
        ON l.room_id = r.room_id
      LEFT JOIN dorms d
        ON r.dorm_id = d.dorm_id
      ORDER BY s.student_code ASC
    `);

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: 'โหลดรายชื่อนักเรียนไม่สำเร็จ' }),
      { status: 500 }
    );
  }
}

