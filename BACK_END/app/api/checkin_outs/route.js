// checkin_outs/route.js
import pool from '@/lib/db';


// =====================
// GET → ดึงข้อมูลประวัติ
// =====================
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        record_id,
        student_code,
        check_in_time,
        check_out_time,
        expected_checkout,
        method_in,
        method_out
      FROM checkin_outs
      ORDER BY record_id DESC
    `);

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'โหลดข้อมูลไม่สำเร็จ' },
      { status: 500 }
    );
  }
}

// =====================
// POST → เช็กอิน / เช็กเอาท์
// =====================
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

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

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

      // ❗ ห้ามออกซ้ำ
      const [active] = await conn.query(`
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

      // 👉 เพิ่มประวัติออกหอ
      await conn.query(`
        INSERT INTO checkin_outs
        (student_code, check_out_time, expected_checkout, method_out)
        VALUES (?, NOW(), ?, ?)
      `, [
        student_code,
        expected_checkout,
        method_out || 'QR'
      ]);

      // 🔥 อัปเดต dorm_status
      await conn.query(`
        UPDATE students
        SET dorm_status = 'Out'
        WHERE student_code = ?
      `, [student_code]);

      await conn.commit();

      return Response.json({ message: 'ออกหอสำเร็จ' });
    }

    // =====================
    // CHECK IN
    // =====================
    if (action === 'check-in') {

      const [result] = await conn.query(`
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

      // 🔥 อัปเดต dorm_status
      await conn.query(`
        UPDATE students
        SET dorm_status = 'IN'
        WHERE student_code = ?
      `, [student_code]);

      await conn.commit();

      return Response.json({ message: 'กลับเข้าหอสำเร็จ' });
    }

    const [student] = await pool.query(`
      SELECT student_status 
      FROM students 
      WHERE student_code = ?
    `, [student_code]);

    if (student[0]?.student_status === 'Inactive') {
      return Response.json(
        { message: 'นักเรียนลาออก ไม่สามารถสแกนได้' },
        { status: 403 }
      );
    }

    await conn.rollback();

    return Response.json(
      { message: 'action ไม่ถูกต้อง' },
      { status: 400 }
    );

  } catch (error) {

    await conn.rollback();
    console.error(error);

    return Response.json(
      { message: 'Database error' },
      { status: 500 }
    );

  } finally {
    conn.release();
  }

}
