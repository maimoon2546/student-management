import db from '@/lib/db';

export async function GET() {
  const conn = await db.getConnection();

  try {
    const [rows] = await conn.query(`
      SELECT MAX(CAST(student_code AS UNSIGNED)) AS max_code
      FROM students
    `);

    const nextCode = (rows[0].max_code || 0) + 1;

    return Response.json({
      student_code: String(nextCode).padStart(4, '0')
    });

  } finally {
    conn.release();
  }
}
