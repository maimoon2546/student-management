// app/api/checkin_outs/status/route.js เกี่ยวกับสถานะเช็กอินล่าสุดของนักเรียน (เช็กว่าเช็กอินอยู่หรือไม่ และคาดว่าจะเช็กเอาท์เมื่อไหร่)
import pool from '@/lib/db';

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const student_code = searchParams.get('student_code');

  if (!student_code) {
    return Response.json({ message: 'missing student_code' }, { status: 400 });
  }

  const [rows] = await pool.query(`
    SELECT check_in_time, expected_checkout
    FROM checkin_outs
    WHERE student_code = ?
    ORDER BY check_out_time DESC
    LIMIT 1
  `, [student_code]);

  if (rows.length === 0) {
    return Response.json({ checkedIn: true });
  }

  return Response.json({
    checkedIn: rows[0].check_in_time !== null,
    expected_checkout: rows[0].expected_checkout
  });
}
