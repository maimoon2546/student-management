// app/scan/[student_code]/page.js
import ScanActions from './ScanActions';
import '@/styles/scan.css';

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
          <p className="error-code">รหัสนักเรียน: {student_code}</p>
          <a href="/" className="back-link">← กลับหน้าหลัก</a>
        </div>
      </div>
    );
  }

  const student = await res.json();

  return (
    <div className="scan-container">
      <div className="scan-card">

        {/* Header */}
        <div className="scan-header">
          <div className="scan-icon">📋</div>
          <h2>ข้อมูลนักเรียน</h2>
        </div>

        {/* Student Info */}
        <div className="student-info-card">
          <div className="avatar-placeholder">
            <span className="avatar-icon">👤</span>
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

            <div className="info-item">
              <span className="info-label">สถานะ</span>
              <span className="info-value status">
                {student.status ? (
                  <span className="status-badge active">
                    ● {student.status}
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
            {/* <form
              action={`/api/students/${student.student_code}/toggle-status`}
              method="POST"
            >
              <button className="manage-btn warning">
                {student.status === 'active'
                  ? '🚫 ปิดการใช้งานนักเรียน'
                  : '✅ เปิดการใช้งานนักเรียน'}
              </button>
            </form>*/}

            <a
              href={`/dashboard/students/${student.student_code}`}
              className="manage-btn primary"
            >
              ⚙️ จัดการข้อมูลนักเรียน
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
