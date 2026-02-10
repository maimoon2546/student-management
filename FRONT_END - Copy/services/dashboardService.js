const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboardData() {
  const res = await fetch(`${API_URL}/api/dashboard`, {
    cache: "no-store", // ให้ดึงข้อมูลใหม่ทุกครั้ง
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}
