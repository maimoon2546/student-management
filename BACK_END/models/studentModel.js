// models/studentModel.js
import pool from '@/lib/db';

// =============================
// ดึงรายชื่อนักเรียนทั้งหมด
// ใช้สำหรับแสดงข้อมูลบนหน้า Frontend
// =============================
export async function findAllStudents() {
  // query ข้อมูลจากตาราง students
  const [rows] = await pool.query(`
    SELECT 
      student_code,   
      parent_id,      
      qr_code,        
      relationship,   
      dorm_status,
      birth_date  
    FROM students
  `);

  return rows;
}

// =============================
// เพิ่มข้อมูลนักเรียนใหม่ในระบบ
// ใช้เฉพาะตอนลงทะเบียนนักเรียนครั้งแรกเท่านั้น
// =============================
export async function createStudent(conn, data) {

  const {
    student_code,    
    title,           
    first_name,     
    last_name,        
    gender,   
    path,        
    birth_date,       
    dorm_status,      
    student_status    
  } = data;

  // บันทึกข้อมูลลงในตาราง students
  await conn.query(
    `
    INSERT INTO students
    (student_code, title, first_name, last_name, gender, path, birth_date, dorm_status, student_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      student_code,
      title,
      first_name,
      last_name,
      gender,
      path,
      birth_date,
      dorm_status,
      student_status
    ]
  );
}

// =============================
// อัปเดตข้อมูลความสัมพันธ์ผู้ปกครอง
// ใช้แทนการ INSERT ข้อมูลนักเรียนซ้ำ
// =============================
export async function updateStudentRelation(conn, data) {

  const { 
    student_code,   
    parent_id,      
    relationship    
  } = data;

  // อัปเดตข้อมูลในตาราง students
  await conn.query(
    `
    UPDATE students
    SET parent_id = ?, relationship = ?
    WHERE student_code = ?
    `,
    [parent_id, relationship, student_code]
  );
}