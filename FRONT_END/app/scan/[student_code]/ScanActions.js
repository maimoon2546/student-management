'use client';

import { useState, useEffect } from 'react';
import '@/styles/scan.css';

export default function ScanActions({ studentCode }) {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [expectedReturn, setExpectedReturn] = useState('');

  // โหลดสถานะ
  useEffect(() => {

    if (!studentCode) return;

    const loadStatus = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/checkin_outs/status?student_code=${studentCode}`
        );

        const data = await res.json();
        setCheckedIn(data.checkedIn);

      } catch {
        console.error('โหลดสถานะไม่สำเร็จ');
      }

    };

    loadStatus();

  }, [studentCode]);

  // ยิง API
  const doAction = async (action, expectedDate = null) => {

    try {

      setLoading(true);
      setMessage('');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkin_outs`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_code: studentCode,
            action,
            expected_checkout: expectedDate
          })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (action === 'check-in') setCheckedIn(true);
      if (action === 'check-out') setCheckedIn(false);

      setMessage(data.message);
      setMessageType('success');

    } catch (err) {

      setMessage(err.message);
      setMessageType('error');

    } finally {

      setLoading(false);

    }

  };

  const confirmCheckout = async () => {

    if (!expectedReturn) {
      setMessage('กรุณาเลือกวันกลับ');
      setMessageType('error');
      return;
    }

    await doAction('check-out', expectedReturn);

    setShowModal(false);
    setExpectedReturn('');
  };

  return (
    <div className="scan-actions">

      <div className="action-buttons">

        <button
          onClick={() => doAction('check-in')}
          disabled={loading || checkedIn}
          className="action-btn check-in-btn"
        >
          {checkedIn ? '⛔ อยู่ในหอแล้ว' : '🏠 กลับเข้าหอ'}
        </button>

        <button
          onClick={() => setShowModal(true)}
          disabled={loading || !checkedIn}
          className="action-btn check-out-btn"
        >
          {!checkedIn ? '⛔ อยู่นอกหอ' : '🚪 ออกหอ'}
        </button>

      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>📅 กำหนดวันกลับเข้าหอ</h3>

            <input
              type="datetime-local"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="modal-input"
            />

            <div className="modal-actions">

              <button
                className="modal-btn cancel"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>

              <button
                className="modal-btn confirm"
                onClick={confirmCheckout}
              >
                ยืนยันออกหอ
              </button>

            </div>

          </div>
        </div>
      )}

      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

    </div>
  );
}
