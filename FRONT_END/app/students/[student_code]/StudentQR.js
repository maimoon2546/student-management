'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import '@/styles/StudentQR.css';

export default function StudentQR({ studentCode }) {
  const [student, setStudent] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (!studentCode) return;

    const loadStudent = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentCode}`);
        if (!res.ok) throw new Error('ไม่พบข้อมูลนักเรียน');

        const data = await res.json();
        setStudent(data);
        setSelectedStudent(data);

        // ถ้ามี QR อยู่แล้ว
        if (data.qr_code) {
          const qr = await QRCode.toDataURL(data.qr_code, {
            width: 150,
            margin: 0,
            color: { dark: '#ffffff', light: '#ffffff00' }
          });
          setQrImage(qr);
          return;
        }

        // ถ้ายังไม่มี QR ให้สร้างใหม่
        const qrValue = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${studentCode}`;
        
        const qr = await QRCode.toDataURL(qrValue, {
          width: 120,
          margin: 0,
          color: { dark: '#ffffff', light: '#ffffff00' }
        });

        // บันทึก QR ลงฐานข้อมูล
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentCode}/qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qr_code: qrValue })
        });

        setQrImage(qr);
      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentCode]);

  if (loading) return <p className="center">กำลังสร้างบัตรนักเรียน...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="studentCard">
      
      {/* ลายน้ำ */}
      <img src="/logos.png" className="watermark" alt="watermark" />

      {/* ด้านหน้าบัตร */}
      <div className="cardLeft">

        {/* ส่วนหัวบัตร */}
        <div className="cardHeader">
          <div className="schoolLogo">
            <img src="/logos.png" alt="logo" />
          </div>

          <div className="schoolInfo">
            <div className="schoolNameTH">โรงเรียนแสงสวรรค์ศาสตร์</div>
            <div className="schoolNameEN">SEANGSAWANSARTS SCHOOL</div>
            <div className="cardTitle">บัตรประจำตัวนักเรียน</div>
          </div>
        </div>

        {/* ส่วนเนื้อหา */}
        <div className="cardBody">

          {/* ข้อมูลนักเรียน */}
          <div className="studentDetails">

            <div className="detailRow">
              <span className="label">ชื่อ - สกุล :</span>
              <span className="value">
                {student.title}{student.first_name} {student.last_name}
              </span>
            </div>

            <div className="detailRow">
              <span className="label">รหัสประจำตัวนักเรียน :</span>
              <span className="value">{student.student_code}</span>
            </div>

            <div className="detailRow">
              <span className="label">วัน เดือน ปีเกิด :</span>
              <span className="detail-value">
                {selectedStudent?.birth_date 
                  ? new Date(selectedStudent.birth_date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : '-'}
              </span>
            </div>

            <div className="qrBox">
              {qrImage && <img src={qrImage} alt="QR" className="qrImage" />}
            </div>

          </div>

          {/* รูปภาพ */}
          <div className="photoSection">
            <div className="studentPhotoBox">
              <img
                src={student.profile_picture || "/profile.jpg"}
                className="studentPhoto"
                alt="student"
              />
            </div>

            <div className="issueDateBox">
              วันที่ออกบัตร : <strong>{new Date().toLocaleDateString('th-TH')}</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}