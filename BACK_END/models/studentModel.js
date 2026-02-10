// models/studentModel.js
import pool from '@/lib/db';

// ดึงรายชื่อนักเรียนไปโชว์ frontend
export async function findAllStudents() {
  const [rows] = await pool.query(`
    SELECT 
      student_code,
      parent_id,
      qr_code,
      relationship,
      status
    FROM students
  `);
  return rows;
}

// INSERT นักเรียน (ครั้งเดียวเท่านั้น)
export async function createStudent(conn, data) {
  const {
    student_code,
    title,
    first_name,
    last_name,
    gender,
    birth_date,
    status
  } = data;

  await conn.query(
    `
    INSERT INTO students
    (student_code, title, first_name, last_name, gender, birth_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      student_code,
      title,
      first_name,
      last_name,
      gender,
      birth_date,
      status
    ]
  );
}

// UPDATE ความสัมพันธ์ (แทน INSERT ซ้ำ ❗)
export async function updateStudentRelation(conn, data) {
  const { student_code, parent_id, relationship } = data;

  await conn.query(
    `
    UPDATE students
    SET parent_id = ?, relationship = ?
    WHERE student_code = ?
    `,
    [parent_id, relationship, student_code]
  );
}


