// เพิ่มข้อมูลนักเรียนใหม่ school_studentsModel.js
export async function insertSchoolStudent(conn, student) {
  await conn.query(
    `INSERT INTO students
     (student_code, title, first_name, last_name, gender, birth_date, path, qr_code,
     parent_id, relationship, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      student.student_code,
      student.title,
      student.first_name,
      student.last_name,
      student.gender,
      student.birth_date,
      student.path,
      student.qr_code,
      student.parent_id,
      student.relationship,
      student.status
    ]
  );
}

// models/school_studentsModel.js

export async function isStudentCodeExists(conn, student_code) {
  const [rows] = await conn.query(
    'SELECT 1 FROM students WHERE student_code = ? LIMIT 1',
    [student_code]
  );
  return rows.length > 0;
}

import pool from '@/lib/db';

// เพิ่มนักเรียนใหม่
/*export async function createSchoolStudent(data) {
  const {
    student_code,
    title,
    first_name,
    last_name,
    gender,
    birth_date,
  } = data;

  await pool.query(
    `INSERT INTO school_students
     (student_code, title, first_name, last_name, gender, birth_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [student_code, title, first_name, last_name, gender, birth_date]
  );
}*/

// ดึงข้อมูลนักเรียนที่กำลังศึกษาอยู่
/*export async function findStudyingStudents() {
  const [rows] = await pool.query(`
    SELECT student_code, title, first_name, last_name, gender, birth_date
    FROM school_students
   
  `);
  return rows;
}*/
