// models/student_dorm_logModel.js
import pool from '../lib/db';

// 🔹 ใช้ตอน POST
export async function createStudentDormLog(data, conn) {
  const {
    student_code,
    room_id,
    expected_leave_year,
    description
  } = data;

  await conn.query(
    `
    INSERT INTO student_dorm_log
    (student_code, room_id, check_in_date, expected_leave_year, description)
    VALUES (?, ?, NOW(), ?, ?)
    `,
    [
      student_code,
      room_id,
      room_id,
      expected_leave_year || null,
      description || null
    ]
  );
}

// 🔹 เช็กว่านักเรียนเข้าหออยู่แล้วไหม
export async function getActiveDormLog(student_code, conn) {
  const [rows] = await conn.query(
    `
    SELECT dorm_log_id
    FROM student_dorm_log
    WHERE student_code = ?
      AND check_out_date IS NULL
    `,
    [student_code]
  );
  return rows;
}

// 🔹 เช็กข้อมูลห้อง
export async function getRoomById(room_id, conn) {
  const [[room]] = await conn.query(
    `
    SELECT capacity, current_occupancy
    FROM rooms
    WHERE room_id = ?
    FOR UPDATE
    `,
    [room_id]
  );
  return room;
}

// 🔹 เพิ่มจำนวนคนในห้อง
export async function increaseRoomOccupancy(room_id, conn) {
  await conn.query(
    `
    UPDATE rooms
    SET current_occupancy = current_occupancy + 1
    WHERE room_id = ?
    `,
    [room_id]
  );
}
