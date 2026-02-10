// checkin_outs/route.js
import pool from '@/lib/db';

export async function POST(req) {

  const {
    action,
    student_code,
    expected_checkout,
    method_in,
    method_out
  } = await req.json();

  if (!student_code || !action) {
    return Response.json(
      { message: 'student_code และ action จำเป็นต้องมี' },
      { status: 400 }
    );
  }

  // =====================
  // CHECK OUT
  // =====================
  if (action === 'check-out') {

    if (!expected_checkout) {
      return Response.json(
        { message: 'ต้องกำหนดวันกลับ' },
        { status: 400 }
      );
    }

    // ❗ ห้ามออกซ้ำ ถ้ายังไม่กลับ
    const [active] = await pool.query(`
      SELECT 1 FROM checkin_outs
      WHERE student_code = ?
      AND check_in_time IS NULL
      LIMIT 1
    `, [student_code]);

    if (active.length > 0) {
      return Response.json(
        { message: 'ยังไม่ได้เช็กอินกลับ' },
        { status: 400 }
      );
    }

    await pool.query(`
      INSERT INTO checkin_outs
      (student_code, check_out_time, expected_checkout, method_out)
      VALUES (?, NOW(), ?, ?)
    `, [
      student_code,
      expected_checkout,
      method_out || 'QR'
    ]);

    return Response.json({ message: 'ออกหอสำเร็จ' });
  }

  // =====================
  // CHECK IN
  // =====================
  if (action === 'check-in') {

    const [result] = await pool.query(`
      UPDATE checkin_outs
      SET check_in_time = NOW(),
          method_in = ?
      WHERE student_code = ?
      AND check_in_time IS NULL
      ORDER BY check_out_time DESC
      LIMIT 1
    `, [
      method_in || 'QR',
      student_code
    ]);

    if (result.affectedRows === 0) {
      return Response.json(
        { message: 'ไม่มีรายการออกหอ' },
        { status: 400 }
      );
    }

    return Response.json({ message: 'กลับเข้าหอสำเร็จ' });
  }

  return Response.json(
    { message: 'action ไม่ถูกต้อง' },
    { status: 400 }
  );
}
