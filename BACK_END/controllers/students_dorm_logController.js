// controllers/students_dorm_logController.js
import pool from '../lib/db';
import {
  createStudentDormLog,
  getActiveDormLog,
  getRoomById,
  increaseRoomOccupancy,
  getStudentAndDormType
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

    // เช็คเข้าหอซ้ำ
    const active = await getActiveDormLog(student_code, conn);
    if (active.length > 0) {
      throw new Error('นักเรียนคนนี้เข้าหอพักอยู่แล้ว');
    }

    // เช็คเพศกับหอ
    const genderCheck = await getStudentAndDormType(room_id, student_code, conn);
    if (!genderCheck) {
      throw new Error('ไม่พบข้อมูล');
    }

    if (genderCheck.gender !== genderCheck.dorm_type) {
      throw new Error('ไม่สามารถเลือกหอนี้ได้');
    }

    // เช็คห้อง
    const room = await getRoomById(room_id, conn);
    if (!room) {
      throw new Error('ไม่พบห้อง');
    }

    if (room.current_occupancy >= room.capacity) {
      throw new Error('ห้องนี้เต็มแล้ว');
    }

    // บันทึก
    await createStudentDormLog(data, conn);
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