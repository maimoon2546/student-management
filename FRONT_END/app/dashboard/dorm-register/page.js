// app/dashboard/dorm-register/page.js ลงทะเบียนเข้าหอพัก

"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAllDorms } from '@/services/dormService';
import { getRoomsByDorm } from '@/services/roomService';
import { createStudentDormLog } from '@/services/studentDormLogService';
import { getStudentByCode } from '@/services/studentService';
import { getSchoolStudentByCode } from '@/services/school_studentService';

export default function DormRegisterPage() {
  const searchParams = useSearchParams();
  const studentCode = searchParams.get('student_code');
  const [student, setStudent] = useState(null);
  const [dorms, setDorms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    getAllDorms().then(setDorms).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedDorm) {
      setRooms([]);
      setSelectedRoom('');
      return;
    }
    getRoomsByDorm(selectedDorm).then(setRooms).catch(console.error);
  }, [selectedDorm]);

  useEffect(() => {
    if (!studentCode) return;

    getSchoolStudentByCode(studentCode)
      .then(data => {
        console.log('STUDENT:', data);
        setStudent(data);
      })
      .catch(err => {
        console.error(err);
        setStudent(null);
      });
  }, [studentCode]);

  const handleSubmit = async () => {
    if (!selectedDorm || !selectedRoom) {
      setAlertMessage({ type: 'error', text: 'กรุณาเลือกหอพักและห้องพัก' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createStudentDormLog({
        student_code: studentCode,
        dorm_id: selectedDorm,
        room_id: selectedRoom,
        description: description,
        

      });

      setAlertMessage({ type: 'success', text: 'ลงทะเบียนเข้าหอพักสำเร็จ!' });
      
      // Reset form after success
      setTimeout(() => {
        setSelectedDorm('');
        setSelectedRoom('');
        setAlertMessage(null);
      }, 3000);
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message || 'เกิดข้อผิดพลาด' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedDorm('');
    setSelectedRoom('');
    setDescription('');
    setAlertMessage(null);
  };

  return (
    <div className="content-wrapper">
      {/* Page Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">🏠</span>
        </div>
        <div>
          <h1 className="page-title-register">ลงทะเบียนเข้าหอพัก</h1>
          <p className="page-subtitle-register">
            เลือกหอพักและห้องพักสำหรับนักเรียน
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="register-container">
        {/* Form Section */}
        <div className="register-form">
          {/* Student Info Section */}
          {student && (
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👨‍🎓</span>
                ข้อมูลนักเรียน
              </h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">รหัสนักเรียน</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🎫</span>
                    <input
                      type="text"
                      className="form-input"
                      value={student.student_code}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      className="form-input"
                      value={`${student.title}${student.first_name} ${student.last_name}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">เพศ</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      {student.gender === 'ชาย' ? '👨' : '👩'}
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      value={student.gender}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">วันเกิด</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      type="text"
                      className="form-input"
                      value={student.birth_date?.slice(0, 10) || '-'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!student && studentCode && (
            <div className="alert-message error">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">ไม่พบข้อมูลนักเรียน</span>
            </div>
          )}

          {!studentCode && (
            <div className="alert-message error">
              <span className="alert-icon">❌</span>
              <span className="alert-text">ไม่พบรหัสนักเรียนในระบบ</span>
            </div>
          )}

          {/* Dorm Selection Section */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">🏘️</span>
              เลือกหอพัก
            </h3>

            <div className="form-group">
              <label className="form-label">
                หอพัก <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <span className="select-icon">🏢</span>
                <select
                  className="form-select"
                  value={selectedDorm}
                  onChange={(e) => setSelectedDorm(e.target.value)}
                >
                  <option value="">-- กรุณาเลือกหอพัก --</option>
                  {dorms.map(d => (
                    <option key={d.dorm_id} value={d.dorm_id}>
                      {d.dorm_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                ห้องพัก <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <span className="select-icon">🚪</span>
                <select
                  className="form-select"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  disabled={!selectedDorm}
                >
                  <option value="">-- กรุณาเลือกห้องพัก --</option>
                  {rooms.map(r => (
                    <option key={r.room_id} value={r.room_id}>
                      ห้อง {r.room_number} (จุได้ {r.capacity} คน)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                รายละเอียดเพิ่มเติม
              </label>
              <div className="textarea-wrapper">
                <span className="textarea-icon">📝</span>
                <textarea
                  className="form-textarea"
                  placeholder="เช่น เข้าพักชั่วคราว / ย้ายจากหอเดิม / หมายเหตุเพิ่มเติม"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Alert Message */}
          {alertMessage && (
            <div className={`alert-message ${alertMessage.type}`}>
              <span className="alert-icon">
                {alertMessage.type === 'success' ? '✅' : '⚠️'}
              </span>
              <span className="alert-text">{alertMessage.text}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedDorm || !selectedRoom}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <span>💾</span>
                  บันทึกเข้าหอพัก
                </>
              )}
            </button>

            <button
              className="reset-button"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <span>🔄</span>
              ล้างข้อมูล
            </button>
          </div>
        </div>

        {/* Info Card Side */}
        <div className="info-card-side">
          <div className="info-header">
            <span className="info-icon">ℹ️</span>
            <h3>คำแนะนำ</h3>
          </div>

          <ul className="info-list">
            <li className="info-item">
              <span className="check-icon">✓</span>
              ตรวจสอบข้อมูลนักเรียนให้ถูกต้อง
            </li>
            <li className="info-item">
              <span className="check-icon">✓</span>
              เลือกหอพักที่ต้องการ
            </li>
            <li className="info-item">
              <span className="check-icon">✓</span>
              เลือกห้องพักที่ว่าง
            </li>
            <li className="info-item">
              <span className="check-icon">✓</span>
              ตรวจสอบจำนวนที่นั่งในห้อง
            </li>
          </ul>

          <div className="info-note">
            <span className="note-icon">💡</span>
            <p>
              กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนกดบันทึก 
              เมื่อบันทึกแล้วสามารถแก้ไขได้ในภายหลัง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}