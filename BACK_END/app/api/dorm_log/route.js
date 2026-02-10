import pool from '@/lib/db';

export async function GET() {
  const [rows] = await pool.query(`
    SELECT
      student_code,
      check_in_time,
      check_out_time
    FROM checkin_outs
    ORDER BY check_in_time DESC
    LIMIT 100
  `);

  return Response.json(rows);
}
