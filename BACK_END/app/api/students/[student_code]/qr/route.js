// app/api/students/[student_code]/qr/route.js
import pool from '@/lib/db';

// POST /api/students/:student_code/qr
export async function POST(req, { params }) {
  const { student_code } = await params;
  const { qr_code, path } = await req.json();

  if (!qr_code) {
    return Response.json(
      { message: 'qr_code is required' },
      { status: 400 }
    );
  }

  try {
    // 🔍 เช็กว่ามี QR อยู่แล้วไหม
    const [rows] = await pool.query(
      'SELECT qr_code FROM students WHERE student_code = ?',
      [student_code]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: 'ไม่พบนักเรียน' },
        { status: 404 }
      );
    }

    // ❌ ถ้ามี QR แล้ว → ไม่ให้เขียนทับ
    if (rows[0].qr_code) {
      return Response.json(
        { message: 'QR code already exists' },
        { status: 200 }
      );
    }

    // ✅ บันทึก QR ครั้งแรกเท่านั้น
    await pool.query(
      `
      UPDATE students
      SET qr_code = ?, path = ?
      WHERE student_code = ?
      `,
      [qr_code, path || null, student_code]
    );

    return Response.json({
      message: 'QR code saved successfully',
      qr_code,
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'Database error' },
      { status: 500 }
    );
  }
}
