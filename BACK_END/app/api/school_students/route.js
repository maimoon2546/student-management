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
        student_code,
        title,
        first_name,
        last_name,
        gender
      FROM students
      ORDER BY student_code ASC
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


// GET /api/school_students
/*import { getSchool_Students, storeSchool_Students } from '@/controllers/school_studentsController';
export async function GET() {
  try {
    const data = await getSchool_Students();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}*/

// POST /api/school_students
/*export async function POST(req) {
  try {
    const data = await req.json();
    await storeSchool_Students(data);
    return Response.json({ message: 'บันทึกข้อมูลสำเร็จ' });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 400 }
    );
  }
}*/

