import pool from '@/lib/db';

export const DormExitModel = {
  exitDorm: async ({ student_id, exit_date }) => {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [logs] = await conn.query(
        `
        SELECT dorm_log_id, room_id
        FROM student_dorm_log
        WHERE student_code = ?
        AND check_out_date IS NULL
        LIMIT 1
        `,
        [student_id]
      );

      if (logs.length === 0) {
        throw new Error('ไม่พบข้อมูลนักเรียนที่กำลังพักอยู่');
      }

      const { dorm_log_id, room_id } = logs[0];

      // อัปเดต log ว่าย้ายออก
      await conn.query(
        `
        UPDATE student_dorm_log
        SET check_out_date = ?
        WHERE dorm_log_id = ?
        `,
        [exit_date, dorm_log_id]
      );

      // เปลี่ยนสถานะนักเรียน
      await conn.query(
        `
        UPDATE students
        SET student_status = 'Inactive',
            dorm_status = NULL
        WHERE student_code = ?
        `,
        [student_id]
      );

      // ลดจำนวนคนในห้อง
      await conn.query(
        `
        UPDATE rooms
        SET current_occupancy = GREATEST(current_occupancy - 1, 0)
        WHERE room_id = ?
        `,
        [room_id]
      );

      await conn.commit();
    } catch (error) {
      console.error('EXIT ERROR:', error);
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  getStudentDorm: async (student_code) => {
    const [rows] = await pool.query(
      `
      SELECT 
        s.student_code,
        s.first_name,
        s.last_name,
        r.room_number,
        r.room_id
      FROM student_dorm_log l
      JOIN students s ON s.student_code = l.student_code
      JOIN rooms r ON r.room_id = l.room_id
      WHERE l.student_code = ?
      AND l.check_out_date IS NULL
      LIMIT 1
      `,
      [student_code]
    );

    return rows[0];
  }
};