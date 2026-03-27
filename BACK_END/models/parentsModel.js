// models/parentsModel.js

// =============================
// เพิ่มข้อมูลผู้ปกครองลงในฐานข้อมูล
// ใช้ตอนลงทะเบียนผู้ปกครองของนักเรียน
// =============================
export async function insertParent(conn, parent) {

  // ดึงข้อมูลผู้ปกครองจาก object ที่รับเข้ามา
  const { 
    title,       
    first_name,  
    last_name,   
    gender,      
    phone,       
    email,      
    address      
  } = parent;

  // บันทึกข้อมูลลงในตาราง parents
  const [result] = await conn.query(
    `
    INSERT INTO parents
    (title, first_name, last_name, gender, phone, email, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, first_name, last_name, gender, phone, email, address]
  );

  // ส่งค่า ID ของผู้ปกครองที่เพิ่งถูกสร้างกลับไป
  // เพื่อนำไปเชื่อมกับข้อมูลนักเรียน (parent_id)
  return result.insertId;
}