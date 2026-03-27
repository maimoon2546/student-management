'use client';

import { useState, useEffect } from 'react';

export default function ParentMessageBox({ studentCode }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(null);

  // ดึง parent จาก localStorage
  useEffect(() => {
    const parentData = localStorage.getItem('parent');
    if (parentData) {
      const parent = JSON.parse(parentData);
      setParentId(parent.id);
    }
  }, []);

  const submitMessage = async () => {
    if (!message.trim()) {
      setStatus('❗ กรุณากรอกข้อความ');
      return;
    }

    if (!parentId) {
      setStatus('❌ ไม่พบข้อมูลผู้ปกครอง');
      return;
    }

    try {
      setLoading(true);
      setStatus('');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent-messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_code: studentCode,
            parent_id: parentId,
            message
          })
        }
      );

      if (!res.ok) throw new Error();

      setMessage('');
      setStatus('✅ ส่งข้อความถึงผู้ดูแลหอแล้ว');
    } catch {
      setStatus('❌ ส่งข้อความไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-message-card">
      <h3>✉️ ฝากข้อความถึงผู้ดูแลหอพัก</h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="พิมพ์ข้อความถึงหอพักหรือเจ้าหน้าที่..."
        rows={4}
      />

      <button
        onClick={submitMessage}
        disabled={loading}
        className="send-btn"
      >
        {loading ? 'กำลังส่ง...' : '📩 ส่งข้อความ'}
      </button>

      {status && <p className="message-status">{status}</p>}
    </div>
  );
}