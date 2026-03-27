// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role,
      student_code
    } = body;

    // ================= STAFF =================
    if (role === 'staff') {
      if (!username || !password || !first_name || !last_name) {
        return NextResponse.json(
          { message: 'กรอกข้อมูลให้ครบ' },
          { status: 400 }
        );
      }

      const [existing] = await pool.query(
        `SELECT staff_id FROM staff WHERE username = ?`,
        [username]
      );

      if (existing.length > 0) {
        return NextResponse.json(
          { message: 'Username นี้มีอยู่แล้ว' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO staff
        (username, password, first_name, last_name, role, last_login)
        VALUES (?, ?, ?, ?, 'staff', NOW())`,
        [username, hashedPassword, first_name, last_name]
      );

      return NextResponse.json({
        message: 'สมัครเจ้าหน้าที่สำเร็จ'
      });
    }

    // ================= PARENT =================
    if (role === 'parent') {
      if (!email || !password || !student_code) {
        return NextResponse.json(
          { message: 'ข้อมูลไม่ครบ' },
          { status: 400 }
        );
      }

      // หา parent จาก student
      const [student] = await pool.query(
        `SELECT parent_id FROM students WHERE student_code = ?`,
        [student_code]
      );

      if (student.length === 0) {
        return NextResponse.json(
          { message: 'ไม่พบ student นี้' },
          { status: 404 }
        );
      }

      const parent_id = student[0].parent_id;

      // เช็คว่ามี email แล้วหรือยัง
      const [parent] = await pool.query(
        `SELECT email FROM parents WHERE parent_id = ?`,
        [parent_id]
      );

      if (parent[0].email) {
        return NextResponse.json(
          { message: 'ผู้ปกครองนี้สมัครแล้ว' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `UPDATE parents
         SET email = ?, password = ?
         WHERE parent_id = ?`,
        [email, hashedPassword, parent_id]
      );

      return NextResponse.json({
        message: 'สมัครผู้ปกครองสำเร็จ'
      });
    }

    return NextResponse.json(
      { message: 'role ไม่ถูกต้อง' },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}