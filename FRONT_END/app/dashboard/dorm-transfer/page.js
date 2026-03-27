'use client';

import { useState, useEffect } from 'react';
import { getStudentByCode } from '@/services/studentService';
import { getRoomsByDorm } from '@/services/roomService';
import { getAllDorms } from '@/services/dormService';
import { transferDorm } from '@/services/studentDormLogService';
import '@/styles/dorm-log.css';
import '@/styles/dorm_transfer.css';

export default function DormTransferPage() {
  const [studentCode, setStudentCode] = useState('');
  const [student, setStudent] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  // 🔎 Auto Search
  useEffect(() => {
    if (!studentCode) {
      setStudent(null);
      setRooms([]);
      return;
    }

    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [studentCode]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const data = await getStudentByCode(studentCode);
      console.log(data);

      if (!data) {
        setStudent(null);
        setMessage('ไม่พบข้อมูลนักเรียน');
        setMessageType('error');
        return;
      }

      // เช็คสถานะหอ
      if (!data.dorm_status || data.dorm_status.toUpperCase() !== 'IN') {
        setStudent(null);
        setMessage('นักเรียนไม่ได้พักอยู่ในหอพัก');
        setMessageType('error');
        return;
      }

      setStudent(data);
      setMessageType('success');

      // โหลดห้องในหอเดียวกัน
      const roomData = await getRoomsByDorm(data.dorm_id);
      setRooms(roomData);

      const dormData = await getAllDorms();
      setDorms(dormData);

    } catch (err) {
      setStudent(null);
      setMessage('เกิดข้อผิดพลาด');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // ย้ายห้อง
  const handleTransfer = async () => {
    if (!selectedRoom) {
      setMessage('กรุณาเลือกห้อง');
      return;
    }

    try {
      await transferDorm({
        student_code: student.student_code,
        old_room_id: student.room_id,
        new_room_id: selectedRoom
      });

      setMessage('ย้ายห้องสำเร็จ');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleReset = () => {
    setStudentCode('');
    setStudent(null);
    setRooms([]);
    setSelectedRoom('');
    setMessage(null);
  };

  return (
    <div className="dorm-log-page">
      {/* Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">🔄</span>
        </div>
        <div className="header-text">
          <h1 className="page-title-register">ย้ายห้องพักนักเรียน</h1>
          <p className="page-subtitle-register">ระบบจัดการย้ายห้องพักนักเรียน</p>
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

      {/* Search Section */}
      <div className="transfer-container">
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
              placeholder="พิมพ์รหัสนักเรียน..."
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              disabled={loading}
            />
            {loading && (
              <div className="input-loader">
                <div className="spinner-small"></div>
              </div>
            )}
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

        {/* Student Info */}
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

            {/* Room Selection */}
            <div className="room-selection-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="title-icon">🏠</span>
                  เลือกห้องใหม่
                </h3>
                <span className="room-count">
                  {rooms.length} ห้องพร้อมใช้งาน
                </span>
              </div>

              <div className="rooms-grid">
                {rooms.length === 0 ? (
                  <div className="empty-rooms">
                    <div className="empty-icon">📭</div>
                    <p>ไม่พบห้องว่างในหอพักนี้</p>
                  </div>
                ) : (
                  rooms.map(room => (
                    <div
                      key={room.room_id}
                      className={`room-card ${selectedRoom === room.room_id ? 'selected' : ''} ${room.remaining === 0 ? 'disabled' : ''}`}
                      onClick={() => room.remaining > 0 && setSelectedRoom(room.room_id)}
                    >
                      <div className="room-number">
                        <span className="room-icon">🚪</span>
                        ห้อง {room.room_number}
                      </div>
                      <div className="room-info">
                        <div className="room-capacity">
                          <span className="capacity-icon">👥</span>
                          <span>{room.capacity - room.remaining}/{room.capacity}</span>
                        </div>
                        <div className={`room-status ${room.remaining > 0 ? 'available' : 'full'}`}>
                          {room.remaining > 0 ? `เหลือ ${room.remaining} ที่` : 'เต็ม'}
                        </div>
                      </div>
                      {selectedRoom === room.room_id && (
                        <div className="selected-badge">
                          <span>✓</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transfer Button */}
            {rooms.length > 0 && (
              <div className="transfer-actions">
                <button
                  className="transfer-btn"
                  onClick={handleTransfer}
                  disabled={!selectedRoom || loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-loader">
                        <div className="spinner-small"></div>
                      </span>
                      <span>กำลังย้ายห้อง...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔄</span>
                      <span>ยืนยันการย้ายห้อง</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}