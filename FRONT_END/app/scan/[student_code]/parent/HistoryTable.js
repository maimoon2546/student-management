'use client';

import { useEffect, useState } from 'react';

export default function HistoryTable({ studentCode }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentCode) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/checkin_outs/history?student_code=${studentCode}`
    )
      .then(res => res.json())
      .then(data => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studentCode]);

  if (loading) {
    return <p>⏳ กำลังโหลดประวัติ...</p>;
  }

  if (logs.length === 0) {
    return <p>📭 ยังไม่มีประวัติการเข้า–ออก</p>;
  }

  return (
    <div className="history-card">
      <h3>📜 ประวัติเข้า–ออก</h3>

      <table className="history-table">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เช็กอิน</th>
            <th>เช็กเอาต์</th>
            <th>ช่องทาง</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((row, index) => (
            <tr key={index}>
              <td>
                {new Date(row.check_in_time).toLocaleDateString('th-TH')}
              </td>
              <td>
                {new Date(row.check_in_time).toLocaleTimeString('th-TH')}
              </td>
              <td>
                {row.check_out_time
                  ? new Date(row.check_out_time).toLocaleTimeString('th-TH')
                  : '—'}
              </td>
              <td>
                {row.method_in || row.method_out || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
