// controllers/students_dorm_logController.js
import pool from '../lib/db';
import {
  createStudentDormLog,
  getActiveDormLog,
  getRoomById,
  increaseRoomOccupancy
} from '../models/student_dorm_logModel';

// GET (ของเดิมคุณ)
export async function getStudentsDormLog() {
  const [rows] = await pool.query(`
    SELECT *
    FROM student_dorm_log
  `);
  return rows;
}

// ✅ POST ลงทะเบียนเข้าหอ
export async function registerStudentDorm(data) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { student_code, room_id } = data;

    // 1️⃣ เช็กว่านักเรียนเข้าหอซ้ำ
    const active = await getActiveDormLog(student_code, conn);
    if (active.length > 0) {
      throw new Error('นักเรียนคนนี้เข้าหอพักอยู่แล้ว');
    }

    // 2️⃣ เช็กห้องเต็ม
    const room = await getRoomById(room_id, conn);
    if (!room) {
      throw new Error('ไม่พบห้อง');
    }

    if (room.current_occupancy >= room.capacity) {
      throw new Error('ห้องนี้เต็มแล้ว');
    }

    // 3️⃣ บันทึก student_dorm_log
    await createStudentDormLog(data, conn);

    // 4️⃣ อัปเดตจำนวนคนในห้อง
    await increaseRoomOccupancy(room_id, conn);

    await conn.commit();
    return { success: true };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
