//checkin_outs/status/route.js
import pool from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const student_code = searchParams.get('student_code');

  if (!student_code) {
    return Response.json(
      { message: 'student_code required' },
      { status: 400 }
    );
  }

  // ⭐ ถ้ามีรายการที่ยังไม่ check-in = ยังอยู่นอกหอ
  const [rows] = await pool.query(`
    SELECT 1
    FROM checkin_outs
    WHERE student_code = ?
    AND check_in_time IS NULL
    LIMIT 1
  `, [student_code]);

  return Response.json({
    checkedIn: rows.length === 0   // TRUE = อยู่ในหอ
  });
}
