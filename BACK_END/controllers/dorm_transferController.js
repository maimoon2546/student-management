import pool from '@/lib/db';

export async function transferStudentDorm(req) {
  try {
    const body = await req.json();
    const { student_code, new_room_id } = body;

    if (!student_code || !new_room_id) {
      return Response.json(
        { message: 'ข้อมูลไม่ครบ' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // หาห้องเดิม
      const [current] = await conn.query(
        `
        SELECT room_id 
        FROM student_dorm_log
        WHERE student_code = ?
        AND check_out_date IS NULL
        LIMIT 1
        `,
        [student_code]
      );

      if (current.length === 0) {
        throw new Error('ไม่พบข้อมูลห้องเดิม');
      }

      const old_room_id = current[0].room_id;

      // เปลี่ยนห้อง (แก้ record เดิม)
      await conn.query(
        `
        UPDATE student_dorm_log
        SET room_id = ?, transfer_date = NOW()
        WHERE student_code = ?
        AND check_out_date IS NULL
        `,
        [new_room_id, student_code]
      );

      // ลดจำนวนห้องเดิม
      await conn.query(
        `
        UPDATE rooms
        SET current_occupancy = current_occupancy - 1
        WHERE room_id = ?
        `,
        [old_room_id]
      );

      // เพิ่มจำนวนห้องใหม่
      await conn.query(
        `
        UPDATE rooms
        SET current_occupancy = current_occupancy + 1
        WHERE room_id = ?
        `,
        [new_room_id]
      );

      await conn.commit();
      conn.release();

      return Response.json({
        message: 'ย้ายห้องสำเร็จ'
      });

    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'เกิดข้อผิดพลาดในการย้ายห้อง' },
      { status: 500 }
    );
  }
}