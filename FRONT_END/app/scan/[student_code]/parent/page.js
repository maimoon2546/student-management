'use client';

import { useState, useEffect, use } from 'react';
import HistoryTable from './HistoryTable';
import { useRouter } from 'next/navigation';
import ParentMessageBox from './ParentMessageBox';
import { getStudentByCode } from '@/services/studentService';
import '@/styles/Parent.css';

export default function ParentScanPage({ params }) {
  const { student_code } = use(params);
  const [view, setView] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ ตรวจสอบ login + redirect ให้ URL ถูกต้อง
  useEffect(() => {
    const parent = localStorage.getItem('parent');

    if (!parent) {
      router.push('/login');
      return;
    }

    const parentData = JSON.parse(parent);

    if (parentData.student_code && parentData.student_code !== student_code) {
      router.replace(`/scan/${parentData.student_code}/parent`);
    }

  }, [student_code]);

  useEffect(() => {
    if (!student_code) return;

    const fetchStudent = async () => {
      try {
        const data = await getStudentByCode(student_code);

        setStudent({
          ...data,
          dorm_name: data.dorm_name,
          room_number: data.room_number
        });

      } catch (err) {
        console.error(err);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [student_code]);

  if (loading) return <p className="loading">กำลังโหลดข้อมูล...</p>;
  if (!student) return <p>ไม่พบข้อมูลนักเรียน</p>;

  return (
    <div className="parent-page">

      <div className="parent-card">

        <div className="parent-header">
          <h2>👨‍👩‍👧 สำหรับผู้ปกครอง</h2>
        </div>

        <div className="student-profile">

          <img
            src={student.profile_picture || "/profile.jpg"}
            className="student-avatar"
            alt="student"
          />

          <div className="student-info">
            <div className="student-name">
              {student.first_name} {student.last_name}
            </div>

            <div className="student-code">
              รหัส: {student.student_code}
            </div>

            <span className="info-value status">
              {student.dorm_status ? (
                <span className={`status-badge ${student.dorm_status === 'IN' ? 'active' : 'inactive'}`}>
                  ● {student.dorm_status === 'IN' ? 'อยู่ในหอพัก' : 'ออกจากหอพัก'}
                </span>
              ) : (
                <span className="status-badge inactive">-</span>
              )}
            </span>

            <div className="student-room">
              หอ: {student.dorm_name || '-'} | ห้อง: {student.room_number || '-'}
            </div>
          </div>

        </div>

        <div className="parent-actions">

          <div
            className={`action-card ${view === 'student' ? 'active' : ''}`}
            onClick={() => setView('student')}
          >
            🎓
            <span>ข้อมูลนักเรียน</span>
          </div>

          <div
            className={`action-card ${view === 'history' ? 'active' : ''}`}
            onClick={() => setView('history')}
          >
            📋
            <span>ดูประวัติการเข้า - ออก</span>
          </div>

        </div>

        {view === 'student' && (
          <div className="parent-box">
            <p>ชื่อ: {student.first_name} {student.last_name}</p>
            <p>วันเกิด:
              <span className="detail-value">
                {student?.birth_date
                  ? new Date(student.birth_date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  : '-'}
              </span>
            </p>
            <p>หอพัก: {student.dorm_name || 'ไม่ระบุ'}</p>
            <p>ห้อง: {student.room_number || '-'}</p>
          </div>
        )}

        {view === 'history' && (
          <div className="parent-history">
            <HistoryTable studentCode={student.student_code} />
          </div>
        )}

        <ParentMessageBox studentCode={student.student_code} />

      </div>

    </div>
  );
}