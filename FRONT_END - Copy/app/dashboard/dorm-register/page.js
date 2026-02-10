"use client";

import { useSearchParams } from 'next/navigation';

export default function DormRegisterPage() {
  const searchParams = useSearchParams();
  const studentCode = searchParams.get('student_code');

  return (
    <>
      <h1>ลงทะเบียนเข้าหอพัก</h1>

      {studentCode ? (
        <p>รหัสนักเรียน: {studentCode}</p>
      ) : (
        <p style={{ color: 'red' }}>ไม่พบรหัสนักเรียน</p>
      )}
    </>
  );
}
