'use client';

import { useEffect, useState } from 'react';
import { DormService } from '@/services/dormService';
import { RoomService } from '@/services/roomService';

export default function DormManagementPage() {
  const [dorms, setDorms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [totalFloor, setTotalFloor] = useState('');
  const [totalRoom, setTotalRoom] = useState('');


  const [dormForm, setDormForm] = useState({
    dorm_name: '',
    total_floors: '',
    total_rooms: '',
    description: '',

  });

  const [roomForm, setRoomForm] = useState({
    room_number: '',
    capacity: '',
    description: '',
  });

  // โหลดหอพัก
  useEffect(() => {
    DormService.getAll().then(setDorms);
  }, []);

  // เลือกหอ → โหลดห้อง
  const handleSelectDorm = async (dorm) => {
    setSelectedDorm(dorm);
    const data = await RoomService.getByDorm(dorm.dorm_id);
    setRooms(data);
  };

  // เพิ่มหอ
  const handleAddDorm = async () => {
    if (!dormForm.dorm_name.trim()) {
      setAlertMessage({ type: 'error', text: 'กรุณากรอกชื่อหอพัก' });
      return;
    }

    setIsSubmitting(true);
    try {
      await DormService.create({
        dorm_name: dormForm.dorm_name,
        description: dormForm.description,
        total_floor: totalFloor,
        total_room: totalRoom,
      });

      setDormForm({ dorm_name: '', description: '', total_floor: '', total_room: '' });
      DormService.getAll().then(setDorms);
      setAlertMessage({ type: 'success', text: 'เพิ่มหอพักสำเร็จ!' });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'เกิดข้อผิดพลาด' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // เพิ่มห้อง
  const handleAddRoom = async () => {
    if (!roomForm.room_number.trim() || !roomForm.capacity) {
      setAlertMessage({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    setIsSubmitting(true);
    try {
      await RoomService.create({
        dorm_id: selectedDorm.dorm_id,
        ...roomForm
      });

      setRoomForm({ room_number: '', capacity: '', description: '' });
      handleSelectDorm(selectedDorm);
      setAlertMessage({ type: 'success', text: 'เพิ่มห้องพักสำเร็จ!' });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'เกิดข้อผิดพลาด' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Page Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">🏢</span>
        </div>
        <div>
          <h1 className="page-title-register">จัดการข้อมูลหอพัก</h1>
          <p className="page-subtitle-register">
            เพิ่ม แก้ไข และจัดการหอพักและห้องพัก
          </p>
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

      <div className="register-container">
        {/* Left Column - Forms */}
        <div>
          {/* เพิ่มหอพัก */}
          <div className="register-form">
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">➕</span>
                เพิ่มหอพัก
              </h3>

              <div className="form-group">
                <label className="form-label">
                  ชื่อหอพัก <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🏠</span>
                  <input
                    className="form-input"
                    placeholder="เช่น หอพักชาย A, หอพักหญิง B"
                    value={dormForm.dorm_name}
                    onChange={e => setDormForm({ ...dormForm, dorm_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  จำนวนชั้น <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🏢</span>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="เช่น 2"
                    value={totalFloor}
                    onChange={e => setTotalFloor(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  จำนวนห้องพัก <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🚪</span>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="เช่น 20"
                    value={totalRoom}
                    onChange={e => setTotalRoom(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">รายละเอียด</label>
                <div className="textarea-wrapper">
                  <span className="textarea-icon">📝</span>
                  <textarea
                    className="form-textarea"
                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับหอพัก"
                    value={dormForm.description}
                    onChange={e => setDormForm({ ...dormForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="submit-button"
                  onClick={handleAddDorm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      บันทึกหอพัก
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* เพิ่มห้อง (แสดงเมื่อเลือกหอแล้ว) */}
          {selectedDorm && (
            <div className="register-form" style={{ marginTop: '25px' }}>
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🚪</span>
                  เพิ่มห้องพักใน {selectedDorm.dorm_name}
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      เลขห้อง <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔢</span>
                      <input
                        className="form-input"
                        placeholder="เช่น 101, 102"
                        value={roomForm.room_number}
                        onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      ความจุ (คน) <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">👥</span>
                      <input
                        className="form-input"
                        type="number"
                        placeholder="เช่น 2, 4"
                        value={roomForm.capacity}
                        onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">รายละเอียด</label>
                  <div className="textarea-wrapper">
                    <span className="textarea-icon">📝</span>
                    <textarea
                      className="form-textarea"
                      placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับห้องพัก"
                      value={roomForm.description}
                      onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="submit-button"
                    onClick={handleAddRoom}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        บันทึกห้องพัก
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Lists */}
        <div>
          {/* รายการหอพัก */}
          <div className="info-card-side">
            <div className="info-header">
              <span className="info-icon">🏘️</span>
              <h3>รายการหอพัก</h3>
            </div>

            {dorms.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <div className="empty-state-icon">🏢</div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  ยังไม่มีหอพักในระบบ
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dorms.map(d => (
                  <button
                    key={d.dorm_id}
                    onClick={() => handleSelectDorm(d)}
                    className="info-item"
                    style={{
                      cursor: 'pointer',
                      border: selectedDorm?.dorm_id === d.dorm_id
                        ? '2px solid #667eea'
                        : '2px solid transparent',
                      background: selectedDorm?.dorm_id === d.dorm_id
                        ? 'linear-gradient(135deg, #f0f4ff, #e8eeff)'
                        : '#f9fafb'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🏢</span>
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: selectedDorm?.dorm_id === d.dorm_id ? '700' : '500' }}>
                      {d.dorm_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* รายการห้อง */}
          {selectedDorm && (
            <div className="info-card-side" style={{ marginTop: '20px' }}>
              <div className="info-header">
                <span className="info-icon">🚪</span>
                <h3>ห้องพักใน {selectedDorm.dorm_name}</h3>
              </div>

              {rooms.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 20px' }}>
                  <div className="empty-state-icon">🚪</div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    ยังไม่มีห้องพักในหอนี้
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rooms.map(r => (
                    <div
                      key={r.room_id}
                      className="info-item"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>🚪</span>
                        <span style={{ fontWeight: '600' }}>ห้อง {r.room_number}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        background: r.current_occupancy >= r.capacity ? '#fee2e2' : '#dcfce7',
                        color: r.current_occupancy >= r.capacity ? '#991b1b' : '#166534',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '700'
                      }}>
                        <span>👥</span>
                        <span>{r.current_occupancy}/{r.capacity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}