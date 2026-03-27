// app/scan/[student_code]/page.js
import ScanActions from './ScanActions';
import AuthGuard from './AuthGuard';
import '@/styles/scan.css';
import { LogIn, LogOut, UserRoundCheck, UserRoundX, Settings } from "lucide-react";

export default async function ScanPage({ params }) {
  const { student_code } = await params;

  // ดึงข้อมูลนักเรียน
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students/${student_code}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return (
      <div className="scan-container">
        <div className="error-card">
          <div className="error-icon">❌</div>
          <h2>ไม่พบข้อมูลนักเรียน</h2>
          <p>รหัสนักเรียน: {student_code}</p>
        </div>
      </div>
    );
  }

  const student = await res.json();

  return (
    <div className="scan-container">
       <AuthGuard />
      <div className="scan-card">

        {/* Header */}
        <div className="scan-header">
          <div className="scan-icon">📋</div>
          <h2>ข้อมูลนักเรียน</h2>
        </div>

        {/* Student Info */}
        <div className="student-info-card">
          <div className="avatar-placeholder">
            <img
              src={student.profile_picture || "/profile.jpg"}
              className="student-avatar"
              alt="student"
            />
          </div>

          <div className="info-list">
            <div className="info-item">
              <span className="info-label">รหัสนักเรียน</span>
              <span className="info-value code">
                {student.student_code}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">ชื่อ-นามสกุล</span>
              <span className="info-value">
                {student.title}{student.first_name} {student.last_name}
              </span>
            </div>

            {/* สถานะนักเรียน */}
            <div className="info-item">
              <span className="info-label">สถานะนักเรียน</span>
              <span className="info-value status">
                {student.student_status === 'Active' ? (
                  <span className="status-badge active">
                    <> <UserRoundCheck size={16} /> กำลังศึกษาอยู่ </>
                  </span>
                ) : (
                  <span className="status-badge inactive">
                    <> <UserRoundX size={16} /> ลาออกแล้ว </>
                  </span>
                )}
              </span>
            </div>

            {/* สถานะหอพัก*/}
            <div className="info-item">
              <span className="info-label">สถานะหอพัก</span>
              <span className="info-value status">
                {student.dorm_status ? (
                  <span
                    className={`status-badge ${student.dorm_status === "IN" ? "active" : "inactive"
                      }`}
                  >
                    {student.dorm_status === "IN" ? (
                      <>
                        <LogIn size={16} /> อยู่ในหอพัก
                      </>
                    ) : (
                      <>
                        <LogOut size={16} /> ออกจากหอพัก
                      </>
                    )}
                  </span>
                ) : (
                  <span className="status-badge inactive">-</span>
                )}
              </span>
            </div>

          </div>
        </div>

        {/* Check-in / Check-out */}
        <ScanActions studentCode={student.student_code} />

        {/* Student Management */}
        <div className="student-manage-card">
          <div className="manage-actions">
            <a
              href={`/dashboard/students?view=manage`}
              className="manage-btn primary"
            >
              <> <Settings size={16} /> จัดการข้อมูลนักเรียน </>
            </a>
          </div>
        </div>


        {/* Footer */}
        <div className="scan-footer">
          <a href="/dashboard" className="back-link">← กลับหน้าหลัก</a>
        </div>

      </div>
    </div>
  );
}
