// สแกนบัตรนักเรียน StudentQR.js
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import '@/styles/StudentQR.css';

export default function StudentQR({ studentCode }) {
  const [student, setStudent] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentCode) return;

    const initQR = async () => {
      try {
        setLoading(true);
        setError('');

        // 1️⃣ ดึงข้อมูลนักเรียน
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentCode}`,
          { cache: 'no-store' }
        );

        if (!res.ok) throw new Error('ไม่พบข้อมูลนักเรียน');

        const studentData = await res.json();
        setStudent(studentData);

        // 2️⃣ ถ้ามี QR แล้ว → ใช้ของเดิม (🔥 ป้องกันซ้ำ)
        if (studentData.qr_code) {
          const img = await QRCode.toDataURL(studentData.qr_code, {
            width: 140,
          });
          setQrImage(img);
          return;
        }

        // 3️⃣ ถ้ายังไม่มี → generate ใหม่
        const newQRValue = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${studentCode}`;
        const img = await QRCode.toDataURL(newQRValue, { width: 140 });

        // 4️⃣ บันทึก QR ลงฐานข้อมูล
        const saveRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentCode}/qr`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              qr_code: newQRValue,
              //path: `/scan/${studentCode}`,
            }),
          }
        );

        if (!saveRes.ok) {
          throw new Error('บันทึก QR Code ไม่สำเร็จ');
        }

        setQrImage(img);

      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    initQR();
  }, [studentCode]);

  if (loading) return <p className="center">กำลังสร้างบัตรนักเรียน...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="student-card">
      <section className="card-left">
        <header className="school-header">
          <h2>โรงเรียนแสงสวรรค์ศาสตร์</h2>
          <p>SEANGSAWANSARTS SCHOOL</p>
        </header>

        <div className="student-info">
          <div className="card-title">บัตรประจำตัวนักเรียน</div>
          <div className="student-name">
            {student.title}{student.first_name} {student.last_name}
          </div>

          <div className="student-code">
            รหัสนักเรียน : <span>{student.student_code}</span>
          </div>

          <img src="/profile.jpg" className="student-photo" />
        </div>

        <footer className="card-footer">
          <span>วันออกบัตร</span>
          <strong>{new Date().toLocaleDateString('th-TH')}</strong>
        </footer>
      </section>

      <section className="card-right">
        {qrImage && <img src={qrImage} alt="QR Code" />}
      </section>
    </div>
  );
}
