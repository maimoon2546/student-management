'use client';
import { useState } from 'react';
import { DormExitService } from '@/services/dormExitService';
import '@/styles/dorm-log.css';
import '@/styles/dorm-exit.css';

export default function DormExitPage() {
  const [studentCode, setStudentCode] = useState('');
  const [student, setStudent] = useState(null);
  const [exitDate, setExitDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const searchStudent = async () => {
    if (!studentCode) {
      setMessage('กรุณากรอกรหัสนักเรียน');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const data = await DormExitService.getStudent(studentCode);
      
      if (!data) {
        setMessage('ไม่พบข้อมูลนักเรียน');
        setMessageType('error');
        setStudent(null);
        return;
      }

      // ตั้งค่าวันที่เป็นวันนี้
      const today = new Date().toISOString().split('T')[0];
      setExitDate(today);
      
      setStudent(data);
      setMessage('พบข้อมูลนักเรียน');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'เกิดข้อผิดพลาด');
      setMessageType('error');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmExit = async () => {
    if (!exitDate) {
      setMessage('กรุณาเลือกวันที่ย้ายออก');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await DormExitService.exitDorm({
        student_id: studentCode,
        exit_date: exitDate
      });

      setMessage('ย้ายออกสำเร็จ');
      setMessageType('success');

      // รีเซ็ตฟอร์มหลังจาก 2 วินาที
      setTimeout(() => {
        setStudent(null);
        setStudentCode('');
        setExitDate('');
        setMessage(null);
      }, 2000);

    } catch (error) {
      setMessage(error.message || 'เกิดข้อผิดพลาดในการย้ายออก');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudentCode('');
    setStudent(null);
    setExitDate('');
    setMessage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      searchStudent();
    }
  };

  return (
    <div className="dorm-log-page">
      {/* Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">🚪</span>
        </div>
        <div className="header-text">
          <h1 className="page-title-register">แจ้งย้ายออกหอพัก</h1>
          <p className="page-subtitle-register">ระบบจัดการย้ายออกหอพักนักเรียน (Admin)</p>
        </div>
        <div className="header-actions">
          <div className="header-actions-row">
            <button 
              className="header-btn header-btn-secondary"
              onClick={handleReset}
            >
              <span className="btn-icon">🔄</span>
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="exit-container">
        {/* Search Card */}
        <div className="search-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">🔍</span>
              ค้นหานักเรียน
            </h3>
          </div>
          
          <div className="search-input-group">
            <div className="input-icon">👤</div>
            <input
              type="text"
              className="search-input-transfer"
              placeholder="กรอกรหัสนักเรียน..."
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            {loading && (
              <div className="input-loader">
                <div className="spinner-small"></div>
              </div>
            )}
          </div>

          <div className="search-actions">
            <button 
              className="search-btn"
              onClick={searchStudent}
              disabled={loading || !studentCode}
            >
              {loading ? (
                <>
                  <span className="btn-loader">
                    <div className="spinner-small"></div>
                  </span>
                  <span>กำลังค้นหา...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🔍</span>
                  <span>ค้นหา</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`alert-box ${messageType}`}>
              <span className="alert-icon">
                {messageType === 'success' ? '✓' : '⚠'}
              </span>
              <span className="alert-text">{message}</span>
            </div>
          )}
        </div>

        {/* Student Info & Exit Form */}
        {student && (
          <>
            <div className="student-info-box">
              <div className="info-box-header">
                <h3 className="info-box-title">
                  <span className="title-icon">👤</span>
                  ข้อมูลนักเรียน
                </h3>
                <span className="status-badge in">
                  <span className="badge-dot"></span>
                  พักอยู่ในหอ
                </span>
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <div className="field-label">รหัสนักเรียน</div>
                  <div className="field-value">
                    <span className="code-badge">{student.student_code}</span>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-label">ชื่อ-นามสกุล</div>
                  <div className="field-value">
                    {student.title}{student.first_name} {student.last_name}
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-label">หอพักปัจจุบัน</div>
                  <div className="field-value highlight">
                    🏠 {student.dorm_name || 'ไม่ระบุ'}
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-label">ห้องปัจจุบัน</div>
                  <div className="field-value highlight">
                    🚪 ห้อง {student.room_number || 'ไม่ระบุ'}
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Date Card */}
            <div className="exit-date-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="title-icon">📅</span>
                  กำหนดวันที่ย้ายออก
                </h3>
              </div>

              <div className="date-input-wrapper">
                <div className="date-label">
                  <span className="label-icon">📅</span>
                  <span>วันที่ย้ายออก</span>
                </div>
                <input
                  type="date"
                  className="date-input"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="date-hint">
                  💡 เลือกวันที่ที่นักเรียนย้ายออกจากหอพัก
                </div>
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="exit-actions">
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <div className="warning-content">
                  <strong>คำเตือน:</strong> การยืนยันย้ายออกจะอัพเดทสถานะนักเรียนเป็น "ย้ายออก" 
                  และปรับปรุงข้อมูลที่นั่งในห้องพัก
                </div>
              </div>

              <button
                className="exit-btn"
                onClick={confirmExit}
                disabled={loading || !exitDate}
              >
                {loading ? (
                  <>
                    <span className="btn-loader">
                      <div className="spinner-small"></div>
                    </span>
                    <span>กำลังดำเนินการ...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✅</span>
                    <span>ยืนยันย้ายออก</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}