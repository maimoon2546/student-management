// หัวใจของงานนี้ อยู่ที่ controller ตัวนี้ ซึ่งจะทำหน้าที่ประสานงานระหว่าง model ต่างๆ เพื่อให้การลงทะเบียนนักเรียนใหม่สำเร็จลุล่วงไปได้ด้วยดี 
import pool from '@/lib/db';
import { createSchoolStudent } from '@/models/school_studentsModel';
import { createParent } from '@/models/parentsModel';
import { createStudent } from '@/models/studentModel';

export async function registerStudent(req) {
  const data = await req.json();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ school_students
    await createSchoolStudent(conn, data);

    // 2️⃣ parents
    const parent_id = await createParent(conn, data);

    // 3️⃣ students
    await createStudent(conn, {
      student_code: data.student_code,
      parent_id,
      relationship: data.relationship,
    });

    await conn.commit();

    return Response.json({ message: 'บันทึกข้อมูลสำเร็จ' });

  } catch (err) {
    await conn.rollback();
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
