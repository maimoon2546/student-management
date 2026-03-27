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

export default function DormBarChart({ year }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        setLoading(true);

        fetch(`${API_URL}/api/dashboard/dorm-stats?year=${year}`)
            .then(res => res.json())
            .then(result => {
                setData(result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [year]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}>
                    <p style={{
                        margin: '0 0 8px 0',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#1f2937',
                        borderBottom: '2px solid #f3f4f6',
                        paddingBottom: '8px'
                    }}>
                        {label}
                    </p>

                    {payload.map((entry, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '3px',
                                background: entry.color
                            }} />
                            <span style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                fontWeight: '600'
                            }}>
                                กลับบ้าน:
                            </span>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: entry.color
                            }}>
                                {entry.value} ครั้ง
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div style={{
                width: '100%',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                ไม่มีข้อมูล
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 12, bottom: 5 }}
                 
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                />

                {/* เดือน */}
                <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={13}
                    tickLine={false}
                />

                <YAxis
                    stroke="#6b7280"
                    tickLine={false}
                    label={{
                        value: 'จำนวนครั้ง (ครั้ง)',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* กลับบ้าน */}
                <Bar
                    dataKey="กลับบ้าน"
                    fill="#22c55e"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                    animationDuration={800}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}