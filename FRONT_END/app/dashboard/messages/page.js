'use client';

import { useEffect, useState } from 'react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parent-messages`);
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error('โหลดข้อความไม่สำเร็จ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>📩 ข้อความจากผู้ปกครอง</h2>

      {loading && <p>กำลังโหลด...</p>}

      {!loading && messages.length === 0 && (
        <p>ยังไม่มีข้อความจากผู้ปกครอง</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            border: '1px solid #ddd',
            padding: 15,
            marginBottom: 12,
            borderRadius: 12,
            background: '#fff'
          }}
        >
          <div style={{ marginBottom: 5 }}>
            <b>รหัสนักเรียน:</b> {msg.student_code}
          </div>

          {msg.student_name && (
            <div style={{ marginBottom: 5 }}>
              <b>ชื่อนักเรียน:</b> {msg.student_name}
            </div>
          )}

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            {msg.message}
          </div>

          <small style={{ color: '#666' }}>
            {new Date(msg.time || msg.date_time).toLocaleString('th-TH')}
          </small>
        </div>
      ))}
    </div>
  );
}