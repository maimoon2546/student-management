import db from "@/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT 
        d.dorm_name,
        COUNT(sdl.student_code) AS total_students
      FROM dorms d
      LEFT JOIN rooms r 
        ON r.dorm_id = d.dorm_id
      LEFT JOIN student_dorm_log sdl 
        ON sdl.room_id = r.room_id
        AND sdl.check_out_date IS NULL
      GROUP BY d.dorm_id, d.dorm_name
      ORDER BY d.dorm_name
    `;

    const [rows] = await db.execute(query);

    const data = rows.map(r => ({
      label: r.dorm_name,
      นักเรียน: r.total_students
    }));

    return Response.json(data);

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Dorm population error" },
      { status: 500 }
    );
  }
}