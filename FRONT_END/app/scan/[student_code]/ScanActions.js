'use client';

import { useState, useEffect } from 'react';
import '@/styles/scan.css';
import { LogIn, LogOut } from "lucide-react";

export default function ScanActions({ studentCode }) {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [checkedIn, setCheckedIn] = useState(true);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expectedCheckout, setExpectedCheckout] = useState('');

  // 1. โหลดสถานะล่าสุด
  useEffect(() => {
    if (!studentCode) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkin_outs/status?student_code=${studentCode}`)
      .then(res => res.json())
      .then(data => {
        setCheckedIn(data.checkedIn);
        setStatusLoaded(true);
      })
      .catch(() => {
        console.error('โหลดสถานะไม่สำเร็จ');
        setStatusLoaded(true); // ให้กดได้แม้ตีกลับ
      });
  }, [studentCode]);

  // 2. ฟังก์ชันเข้า-ออก
  const doAction = async (action, expectedDate = null) => {
    try {
      setLoading(true);
      setMessage('');

      const staffData = JSON.parse(localStorage.getItem('staff') || '{}');

      const payload = {
        student_code: studentCode,
        action,
        method: staffData.username || 'System'
      };

      if (action === 'check-out' && expectedDate) {
        payload.expected_checkout = expectedDate;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkin_outs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'บันทึกไม่สำเร็จ');

      setMessage(data.message);
      setMessageType('success');
      setCheckedIn(action === 'check-in');

    } catch (err) {
      setMessage(err.message || 'เกิดข้อผิดพลาด');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };


  // 3. ยืนยันออกหอ
  const confirmCheckout = async () => {

    if (!expectedCheckout) {
      setMessage('กรุณาเลือกวันกลับ');
      setMessageType('error');
      return;
    }

    await doAction('check-out', expectedCheckout);

    // ปิด Modal หลังทำเสร็จ
    setShowModal(false);
    setExpectedCheckout('');
  };


  return (
    <div className="scan-actions">

      <div className="action-buttons">

        <button
          onClick={() => doAction('check-in')}
          disabled={loading || !statusLoaded || checkedIn}
          className="action-btn check-in-btn"
        >
          {checkedIn ? <><LogIn size={16} /> Check_in แล้ว</> : <><LogIn size={16} /> Check_in</>}
        </button>

        <button
          onClick={() => setShowModal(true)}
          disabled={loading || !statusLoaded || !checkedIn}
          className="action-btn check-out-btn"
        >
           {!checkedIn ? <><LogOut size={16} /> Check_out แล้ว</> : <><LogOut size={16} /> Check_out</>}
        </button>

      </div>


        {/* MODAL วันกลับหอ */}
        {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            
            <h3>📅 กำหนดวันกลับเข้าหอ</h3>
            
            <input 
              type="date" 
              value={expectedCheckout}
              onChange={(e) => setExpectedCheckout(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // เลือกย้อนหลังไม่ได้
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

      {/* ข้อความแจ้งเตือน */}
      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

    </div>
  );
}
