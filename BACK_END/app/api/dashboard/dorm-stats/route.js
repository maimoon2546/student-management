// Next.js API route for monthly home return statistics (show all 12 months)
import db from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || new Date().getFullYear();

    const query = `
      SELECT 
        MONTH(check_out_time) AS month,
        COUNT(*) AS total_home
      FROM checkin_outs
      WHERE YEAR(check_out_time) = ?
      AND check_out_time IS NOT NULL
      GROUP BY MONTH(check_out_time)
    `;

    const [rows] = await db.execute(query, [year]);

    // map ข้อมูลที่ได้จาก DB
    const map = {};
    rows.forEach(r => {
      map[r.month] = r.total_home;
    });

    const monthNames = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    // สร้างครบ 12 เดือน
    const data = monthNames.map((name, index) => ({
      month: `${name} ${year}`,
      กลับบ้าน: map[index + 1] || 0
    }));

    return Response.json(data);

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Dashboard home return stats error" },
      { status: 500 }
    );
  }
}