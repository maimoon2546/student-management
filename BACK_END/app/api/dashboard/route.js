import db from "@/lib/db";

export async function GET() {
  try {

     const [school_students] = await db.execute(`
      SELECT student_code FROM students
    `);

    // 1. สถานะปัจจุบัน (scan เข้าออก)
    const [students] = await db.execute(`
      SELECT status FROM students
    `);

    // 2. ประวัติเข้าหอ / ย้ายออก
    const [student_dorm_log] = await db.execute(`
      SELECT check_in_date, check_out_date
      FROM student_dorm_log
    `);

    const total = school_students.length;
    // นักเรียนที่ยังอยู่ในหอพัก
    const inDorm = student_dorm_log.filter(s => s.check_in_date !== null && s.check_out_date === null).length; 
    // นักเรียนที่ย้ายออกหอพักแล้ว
    const outDorm = student_dorm_log.filter(s => s.check_out_date !== null).length;

    // เดือนปัจจุบัน
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const newThisMonth = student_dorm_log.filter(l => {
      if (!l.check_in_date) return false;
      const d = new Date(l.check_in_date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    const movedOutThisMonth = student_dorm_log.filter(l => {
      if (!l.check_out_date) return false;
      const d = new Date(l.check_out_date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    return Response.json({
      total,
      inDorm,
      outDorm,
      newThisMonth,
      movedOutThisMonth
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Dashboard API error" },
      { status: 500 }
    );
  }
}

/*import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'in') AS inDorm,
        SUM(status = 'out') AS outDorm
      FROM students
    `);

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return Response.json(
      { message: "Dashboard API error" },
      { status: 500 }
    );
  }
}*/