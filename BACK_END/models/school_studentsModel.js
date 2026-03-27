// models/school_studentsModel.js

// =============================
// เพิ่มข้อมูลนักเรียนใหม่เข้าสู่ระบบ
// ใช้สำหรับบันทึกข้อมูลนักเรียนจากหน้าลงทะเบียน
// =============================
export async function insertSchoolStudent(conn, student) {

  await conn.query(
    `INSERT INTO students
     (student_code, title, first_name, last_name, gender, birth_date, path, qr_code,
     parent_id, relationship, student_status, dorm_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      student.student_status,  
      student.dorm_status      
    ]
  );
}

// =============================
// ตรวจสอบว่ารหัสนักเรียนมีอยู่ในระบบแล้วหรือไม่
// ใช้ป้องกันการเพิ่มข้อมูลซ้ำ
// =============================
export async function isStudentCodeExists(conn, student_code) {

  // ค้นหารหัสนักเรียนในฐานข้อมูล
  const [rows] = await conn.query(
    'SELECT 1 FROM students WHERE student_code = ? LIMIT 1',
    [student_code]
  );

  // ถ้ามีข้อมูลอยู่แล้วจะ return true
  // ถ้าไม่มีจะ return false
  return rows.length > 0;
}