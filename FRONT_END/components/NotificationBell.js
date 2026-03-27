'use client';

import { useEffect, useState } from 'react';

export default function NotificationBell() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  const loadMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parent-messages`);
      const data = await res.json();

      if (data.length > messages.length && messages.length !== 0) {
        alert('มีข้อความใหม่จากผู้ปกครอง');
      }

      setMessages(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();

    // refresh ทุก 5 วินาที
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-wrapper">

      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        <span className="bell-icon">🔔</span>

        {messages.length > 0 && (
          <span className="badge">{messages.length}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <h4>📩 ข้อความจากผู้ปกครอง</h4>

          {messages.length === 0 && (
            <p className="empty">ยังไม่มีข้อความ</p>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="notification-item">
              <div className="student">
                รหัสนักเรียน : {msg.student_code}
              </div>

               <div className="student">
                ชื่อนักเรียน : {msg.student_name}
               </div>

              <div className="text">{msg.message}</div>

              <div className="time">
                {new Date(msg.time).toLocaleString('th-TH')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}