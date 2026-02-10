'use client';

import { useState } from 'react';

export default function ParentMessageBox({ studentCode }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submitMessage = async () => {
    if (!message.trim()) {
      setStatus('❗ กรุณากรอกข้อความ');
      return;
    }

    try {
      setLoading(true);
      setStatus('');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent_messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_code: studentCode,
            message
          })
        }
      );

      if (!res.ok) {
        throw new Error('ส่งข้อความไม่สำเร็จ');
      }

      setMessage('');
      setStatus('✅ ส่งข้อความเรียบร้อยแล้ว');
    } catch (err) {
      setStatus('❌ เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-message-card">
      <h3>✉️ ฝากข้อความถึงผู้ดูแลหอพัก</h3>

      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="พิมพ์ข้อความถึงหอพักหรือเจ้าหน้าที่..."
        rows={4}
      />

      <button
        onClick={submitMessage}
        disabled={loading}
        className="send-btn"
      >
        📩 ส่งข้อความ
      </button>

      {status && <p className="message-status">{status}</p>}
    </div>
  );
}
