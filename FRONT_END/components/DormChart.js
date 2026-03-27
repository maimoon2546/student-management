"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function DormPopulationChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard/dorm-population`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        ไม่มีข้อมูล
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 12, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* ชื่อหอ */}
        <XAxis
          dataKey="label"
          tickLine={false}
        />

        {/* จำนวนคน */}
        <YAxis
          tickLine={false}
          label={{
            value: "จำนวนนักเรียน (คน)",
            angle: -90,
            position: "insideLeft"
          }}
        />

        <Tooltip />
        <Legend />

        <Bar
          dataKey="นักเรียน"
          name="จำนวนนักเรียน"
          radius={[8, 8, 0, 0]}
          maxBarSize={70}
          fill="#4f46e5"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}