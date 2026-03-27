//จะเก็บข้อความที่ผู้ปกครองส่งมาในตัวแปร messages ซึ่งเป็น array 
//ที่เก็บ object ของแต่ละข้อความ โดยแต่ละ object 
//จะมี id, student_code, message และ time เพื่อบันทึกข้อมูลของข้อความที่ส่งมา ชั่วคร่าว
import pool from '@/lib/db';

// ================= CORS =================

// ================= SEND MESSAGE =================
export async function POST(req) {
  try {
    const body = await req.json();
    const { student_code, parent_id, message } = body;

    if (!student_code || !parent_id || !message) {
      return Response.json(
        { success: false, message: 'ข้อมูลไม่ครบ' },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO message_parent
      (student_code, parent_id, message)
      VALUES (?, ?, ?)
      `,
      [student_code, parent_id, message]
    );

    return Response.json({
      success: true,
      message: 'ส่งข้อความสำเร็จ'
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// ================= GET ALL MESSAGE =================
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.id,
        m.student_code,
        m.message,
        m.date_time,
        s.first_name,
        s.last_name
      FROM message_parent m
      LEFT JOIN students s
      ON m.student_code = s.student_code
      ORDER BY m.date_time DESC
    `);

    const result = rows.map(row => ({
      id: row.id,
      student_code: row.student_code,
      student_name: `${row.first_name || ''} ${row.last_name || ''}`,
      message: row.message,
      time: row.date_time
    }));

    return Response.json(result);

  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}