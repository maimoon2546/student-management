// models/student_dorm_logModel.js
import pool from '../lib/db';

// =============================
// บันทึกเข้าหอพัก
// =============================
export async function createStudentDormLog(data, conn) {
  const {
    student_code,
    room_id,
    expected_leave_year,
    description
  } = data;

  // เพิ่ม log การเข้าหอ
  await conn.query(
    `
    INSERT INTO student_dorm_log
    (student_code, room_id, check_in_date, expected_leave_year, description)
    VALUES (?, ?, NOW(), ?, ?)
    `,
    [
      student_code,
      room_id,
      expected_leave_year || null,
      description || null
    ]
  );

  // อัปเดตสถานะนักเรียนว่าอยู่ในหอ
  await conn.query(
    `
  UPDATE students
  SET dorm_status = 'IN',
      student_status = 'ACTIVE'
  WHERE student_code = ?
  `,
    [student_code]
  );
}

// =============================
// ตรวจสอบว่านักเรียนอยู่ในหอหรือไม่
// =============================
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

// =============================
// ดึงข้อมูลห้อง
// =============================
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

// =============================
// เพิ่มจำนวนคนในห้อง
// =============================
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

// =============================
// เช็คเอาท์ออกหอ
// =============================
export async function checkOutDorm(student_code, conn) {
  // อัปเดต log
  await conn.query(
    `
    UPDATE student_dorm_log
    SET check_out_date = NOW()
    WHERE student_code = ?
      AND check_out_date IS NULL
    `,
    [student_code]
  );

  // เปลี่ยนสถานะเป็น OUT
  await conn.query(
    `
    UPDATE students
    SET dorm_status = 'OUT'
    WHERE student_code = ?
    `,
    [student_code]
  );
}

// =============================
// ดึงเพศนักเรียนและประเภทหอ
// =============================
export async function getStudentAndDormType(room_id, student_code, conn) {
  const [[data]] = await conn.query(
    `
    SELECT 
      s.gender,
      d.dorm_type
    FROM students s
    JOIN rooms r ON r.room_id = ?
    JOIN dorms d ON d.dorm_id = r.dorm_id
    WHERE s.student_code = ?
    `,
    [room_id, student_code]
  );

  return data;
}