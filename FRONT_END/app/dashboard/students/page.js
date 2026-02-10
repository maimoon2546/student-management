//app/dashboard/students/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 👉 school_studentService
import {
  createSchoolStudent,
  updateSchoolStudent,
  generateStudentCode,
  getSchoolStudent
} from '@/services/school_studentService';

// 👉 studentService
import {
  getAllStudents,
  getStudentByCode
} from '@/services/studentService';


export default function StudentRegisterPage() {
  const router = useRouter();
  const [studentCode, setStudentCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('ชาย');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('register');
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [manageError, setManageError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedStudentCode, setSavedStudentCode] = useState('');
  const [parent, setParent] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: 'ชาย',
    phone: '',
    email: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentCode) {
      setMessage('กรุณากดปุ่มสร้างรหัสนักเรียนก่อน');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const result = await createSchoolStudent({
        student: {
          student_code: studentCode,
          title,
          first_name: firstName,
          last_name: lastName,
          gender,
          birth_date: birthDate,
        },
        parent: {
          title: parent.title,
          first_name: parent.firstName,
          last_name: parent.lastName,
          gender: parent.gender,
          phone: parent.phone,
          email: parent.email,
          address: parent.address,
        },
        relationship: 'บิดา'
      });

      const savedCode = result.student_code; // 🔥 ตัวจริงจาก backend

      setMessage(`บันทึกข้อมูลสำเร็จ (รหัส ${savedCode})`);
      setIsSuccess(true);

      setSavedStudentCode(savedCode);
      setShowConfirm(true);   // 🔥 เปิด modal

      /*setTimeout(() => {
        router.push(`/dashboard/dorm-register?student_code=${savedCode}`);
      }, 1000);*/

    } catch (err) {
      setMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentCode.length < 4) return;

    let timer;

    const fetchStudent = async () => {
      try {
        const student = await getStudentByCode(studentCode);

        setTitle(student.title);
        setFirstName(student.first_name);
        setLastName(student.last_name);
        setGender(student.gender);
        setBirthDate(student.birth_date?.slice(0, 10));

        setMessage('พบข้อมูลนักเรียนแล้ว');
        setIsSuccess(true);

        timer = setTimeout(() => {
          setMessage('');
          setIsSuccess(false);
        }, 20000);
      } catch (err) {
        setMessage('');
        setIsSuccess(false);
      }
    };

    fetchStudent();

    return () => clearTimeout(timer);
  }, [studentCode]);

  const handleGenerate = async () => {
    const { student_code } = await generateStudentCode();
    setStudentCode(student_code);
    setViewMode('register'); // กันพลาด
  };

  useEffect(() => {
    if (viewMode !== 'manage') return;

    const loadStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudentList(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();
  }, [viewMode]);

  const handleSearchStudent = async () => {
    if (!studentCodeInput) {
      setManageError('กรุณากรอกรหัสนักเรียน');
      return;
    }

    const student = await getSchoolStudent(studentCodeInput);

    if (!student) {
      setManageError('ไม่พบนักเรียน');
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(student);
    setManageError('');
  };


  return (
    <>
      {/* Page Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">👨‍🎓</span>
        </div>

        <div>
          <h1 className="page-title-register">ลงทะเบียนนักเรียน</h1>
          <p className="page-subtitle-register">กรอกข้อมูลนักเรียน</p>
        </div>

        <div className="header-actions">
          <div className="header-actions-row">
            <button
              onClick={handleGenerate}
              className="header-btn header-btn-primary"
            >
              <span className="btn-icon">➕</span>
              <span>ลงทะเบียนนักเรียนใหม่</span>
            </button>

            <button
              type="button"
              className="header-btn header-btn-secondary"
              onClick={() => setViewMode('manage')}
            >
              <span className="btn-icon">⚙️</span>
              <span>จัดการข้อมูลนักเรียน</span>
            </button>

          </div>

          {studentCode && (
            <div className="success-message">
              <span>เพิ่มรหัสนักเรียนสำเร็จ | รหัส: <span className="student-code">{studentCode}</span></span>
            </div>
          )}
        </div>
      </div>


      {viewMode === 'register' && (
        <>
          {/* Main Form Card */}
          <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
              {/* Student Code Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🔢</span>
                  ข้อมูลนักเรียน
                </h3>

                <div className="form-group">
                  <label className="form-label">
                    รหัสนักเรียน
                    <span className="required">*</span>
                  </label>

                  <div className="input-wrapper">

                    <input
                      type="text"
                      className="form-input"
                      placeholder="กดปุ่มเพิ่มนักเรียนเพื่อสร้างรหัส"
                      value={studentCode}
                      readOnly
                    />

                  </div>
                </div>
              </div>

              {/* ข้อมูลส่วนตัวนักเรียน */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📝</span>
                  ข้อมูลส่วนตัว
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      คำนำหน้าชื่อ
                      <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        className="form-select"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      >
                        <option value="">เลือกคำนำหน้า</option>
                        <option value="เด็กชาย">เด็กชาย</option>
                        <option value="เด็กหญิง">เด็กหญิง</option>
                        <option value="นาย">นาย</option>
                        <option value="นางสาว">นางสาว</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      เพศ
                      <span className="required">*</span>
                    </label>
                    <div className="radio-group">
                      <label className={`radio-label ${gender === 'ชาย' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="ชาย"
                          checked={gender === 'ชาย'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        <span>ชาย</span>
                        <span className="radio-icon">👦</span>
                      </label>
                      <label className={`radio-label ${gender === 'หญิง' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="หญิง"
                          checked={gender === 'หญิง'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        <span>หญิง</span>
                        <span className="radio-icon">👧</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      ชื่อ
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">

                      <input
                        type="text"
                        className="form-input"
                        placeholder="กรอกชื่อ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      นามสกุล
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">

                      <input
                        type="text"
                        className="form-input"
                        placeholder="กรอกนามสกุล"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    วันเดือนปีเกิด
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      className="form-input"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />

                  </div>
                </div>
              </div>


              {/* ข้อมูลส่วนตัวผู้ปกครอง */}
              {studentCode.length === 4 && (
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">👨‍👩‍👧</span>
                    ข้อมูลผู้ปกครอง
                  </h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        คำนำหน้าชื่อผู้ปกครอง
                        <span className="required">*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={parent.title}
                          onChange={(e) =>
                            setParent({ ...parent, title: e.target.value })
                          }
                          required
                        >
                          <option value="">เลือกคำนำหน้า</option>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        เพศผู้ปกครอง
                        <span className="required">*</span>
                      </label>
                      <div className="radio-group">
                        <label className={`radio-label ${parent.gender === 'ชาย' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="parent_gender"
                            value="ชาย"
                            checked={parent.gender === 'ชาย'}
                            onChange={(e) =>
                              setParent({ ...parent, gender: e.target.value })
                            }
                          />
                          <span className="radio-custom"></span>
                          <span>ชาย</span>
                        </label>

                        <label className={`radio-label ${parent.gender === 'หญิง' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="parent_gender"
                            value="หญิง"
                            checked={parent.gender === 'หญิง'}
                            onChange={(e) =>
                              setParent({ ...parent, gender: e.target.value })
                            }
                          />
                          <span className="radio-custom"></span>
                          <span>หญิง</span>
                        </label>
                      </div>
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        ชื่อผู้ปกครอง
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">

                        <input
                          type="text"
                          className="form-input"
                          placeholder="กรอกชื่อผู้ปกครอง"
                          value={parent.firstName}
                          onChange={(e) =>
                            setParent({ ...parent, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        นามสกุลผู้ปกครอง
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">

                        <input
                          type="text"
                          className="form-input"
                          placeholder="กรอกนามสกุลผู้ปกครอง"
                          value={parent.lastName}
                          onChange={(e) =>
                            setParent({ ...parent, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        เบอร์โทรศัพท์
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">

                        <input
                          type="tel"
                          className="form-input"
                          placeholder="081-XXX-XXXX"
                          value={parent.phone}
                          onChange={(e) =>
                            setParent({ ...parent, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        อีเมล
                      </label>
                      <div className="input-wrapper">

                        <input
                          type="email"
                          className="form-input"
                          placeholder="example@email.com"
                          value={parent.email}
                          onChange={(e) =>
                            setParent({ ...parent, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      ที่อยู่
                      <span className="required">*</span>
                    </label>
                    <div className="textarea-wrapper">
                      <textarea
                        className="form-textarea"
                        rows="4"
                        placeholder="&#10;เช่น: 123 หมู่ 4 ต.ตำบล อ.อำเภอ จ.จังหวัด 90110"
                        value={parent.address}
                        onChange={(e) =>
                          setParent({ ...parent, address: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>บันทึกข้อมูล</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="reset-button"
                  onClick={() => {
                    setStudentCode('');
                    setTitle('');
                    setFirstName('');
                    setLastName('');
                    setGender('ชาย');
                    setBirthDate('');
                    setMessage('');
                  }}
                >
                  <span>🔄</span>
                  <span>ล้างข้อมูล</span>
                </button>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`alert-message ${isSuccess ? 'success' : 'error'}`}>
                  <span className="alert-icon">
                    {isSuccess ? '✅' : '⚠️'}
                  </span>
                  <span className="alert-text">{message}</span>
                </div>
              )}
            </form >

            {/* Info Card */}
            < div className="info-card-side" >
              <div className="info-header">
                <span className="info-icon">ℹ️</span>
                <h3>ข้อมูลที่ต้องการ</h3>
              </div>
              <ul className="info-list">
                <li className="info-item">
                  <span className="check-icon">✓</span>
                  <span>รหัสนักเรียน</span>
                </li>
                <li className="info-item">
                  <span className="check-icon">✓</span>
                  <span>คำนำหน้าชื่อ</span>
                </li>
                <li className="info-item">
                  <span className="check-icon">✓</span>
                  <span>ชื่อ - นามสกุล</span>
                </li>
                <li className="info-item">
                  <span className="check-icon">✓</span>
                  <span>เพศ</span>
                </li>
                <li className="info-item">
                  <span className="check-icon">✓</span>
                  <span>วันเกิด</span>
                </li>
              </ul>

              <div className="info-note">
                <span className="note-icon">💡</span>
                <p>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง เพื่อความสะดวกในการใช้งานระบบ</p>
              </div>
            </div >
          </div >
        </>
      )}

      {viewMode === 'manage' && (
        <div className="manage-container">
          {/* Header with Actions */}
          <div className="manage-header">
            <h2 className="manage-title">
              <span className="title-icon">👥</span>
              จัดการข้อมูลนักเรียน
            </h2>

            <div className="manage-actions">
              <button className="action-btn import-btn">
                <span>📥</span> นำเข้า
              </button>
              <button className="action-btn export-btn">
                <span>📤</span> ส่งออก
              </button>
              <button
                className="action-btn add-btn"
                onClick={() => setViewMode('register')}
              >
                <span>➕</span> เพิ่มนักเรียน
              </button>
            </div>
          </div>

          {/* Filters 
          <div className="filters-row">
            <select className="filter-select">
              <option>ทุกคำนำหน้า</option>
              <option>เด็กชาย</option>
              <option>เด็กหญิง</option>
              <option>นาย</option>
              <option>นางสาว</option>
            </select>

            <select className="filter-select">
              <option>ทุกเพศ</option>
              <option>ชาย</option>
              <option>หญิง</option>
            </select>

            <select className="filter-select">
              <option>ทุกสถานะ</option>
              <option>กำลังศึกษา</option>
              <option>สำเร็จการศึกษา</option>
            </select>
          </div>*/}

          {/* Search Bar */}
          <div className="search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="ค้นหารหัส, ชื่อ, นามสกุล..."
                value={studentCodeInput}
                onChange={(e) => setStudentCodeInput(e.target.value)}
              />
            </div>
            <button className="search-btn" onClick={handleSearchStudent}>
              ค้นหา
            </button>
            <button
              className="reset-btn"
              onClick={() => {
                setStudentCodeInput('');
                setManageError('');
              }}
            >
              🔄 รีเซ็ต
            </button>
          </div>

          {/* Selected Student Detail Modal (Optional) */}
          {selectedStudent && (
            <div className="student-detail-card">
              <div className="detail-header">
                <h3>📋 รายละเอียดนักเรียน</h3>
                <button
                  className="close-btn"
                  onClick={() => setSelectedStudent(null)}
                >
                  ✕
                </button>
              </div>
              <div className="detail-body">
                <div className="detail-row">
                  <span className="detail-label">รหัสนักเรียน:</span>
                  <span className="detail-value">{selectedStudent.student_code}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ชื่อ-นามสกุล:</span>
                  <span className="detail-value">
                    {selectedStudent.title}{selectedStudent.first_name} {selectedStudent.last_name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">เพศ:</span>
                  <span className="detail-value">{selectedStudent.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วันเกิด:</span>
                  <span className="detail-value">
                    {selectedStudent.birth_date ?
                      new Date(selectedStudent.birth_date).toLocaleDateString('th-TH') : '-'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {manageError && (
            <div className="manage-error">{manageError}</div>
          )}

          {/* Data Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>รหัสนักเรียน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>เพศ</th>
                  <th>วันเกิด</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {studentList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>ไม่พบข้อมูลนักเรียน</h3>
                        <p>เริ่มต้นโดยการเพิ่มนักเรียนคนแรกของคุณ</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  studentList.map((student) => (
                    <tr key={student.student_code}>
                      <td>
                        <span className="student-code-badge">
                          {student.student_code}
                        </span>
                      </td>
                      <td>
                        <div className="student-name">
                          <span className="name-icon">👤</span>
                          <span>{student.title}{student.first_name} {student.last_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`gender-badge ${student.gender === 'ชาย' ? 'male' : 'female'}`}>
                          {student.gender === 'ชาย' ? '👦 ชาย' : '👧 หญิง'}
                        </span>
                      </td>
                      <td>
                        {student.birth_date ?
                          new Date(student.birth_date).toLocaleDateString('th-TH') : '-'
                        }
                      </td>
                      <td>
                        <span className="status-badge active">
                          ✓ กำลังศึกษา
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view-btn"
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentCodeInput(student.student_code);
                            }}
                            title="ดูรายละเอียด"
                          >
                            👁️
                          </button>

                          <button
                            className="icon-btn dorm-btn"
                            title="ลงทะเบียนหอพัก"
                            onClick={() => {
                              router.push(
                                `/dashboard/dorm-register?student_code=${student.student_code}&mode=late`
                              );
                            }}
                          >
                            🏠
                          </button>

                          <button
                            className="icon-btn qr-btn"
                            title="ออกบัตรนักเรียน"
                            onClick={() =>
                              router.push(`/students/${student.student_code}`)
                            }
                          >
                            🪪
                          </button>

                          <button
                            className="icon-btn edit-btn"
                            onClick={() => {
                              console.log('Edit:', student.student_code);
                            }}
                            title="แก้ไข"
                          >
                            ✏️
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            onClick={() => {
                              if (
                                confirm(`ต้องการลบนักเรียน ${student.first_name} ${student.last_name}?`)
                              ) {
                                console.log('Delete:', student.student_code);
                              }
                            }}
                            title="ลบ"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {studentList.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                แสดง 1-{Math.min(10, studentList.length)} จาก {studentList.length} รายการ
              </div>

              <div className="pagination-controls">
                <button className="page-btn" title="หน้าแรก">«</button>
                <button className="page-btn" title="ก่อนหน้า">‹</button>
                <span className="page-current">หน้า 1/{Math.ceil(studentList.length / 10)}</span>
                <button className="page-btn" title="ถัดไป">›</button>
                <button className="page-btn" title="หน้าสุดท้าย">»</button>
              </div>

              <select className="rows-select">
                <option value="10">10 รายการ</option>
                <option value="25">25 รายการ</option>
                <option value="50">50 รายการ</option>
                <option value="100">100 รายการ</option>
              </select>
            </div>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>🎓 สร้างบัตรนักเรียน</h3>
            <p>ต้องการสร้างบัตรนักเรียนพร้อม QR Code ตอนนี้หรือไม่?</p>

            <div className="modal-actions">
              <button
                onClick={() =>
                  router.push(`/students/${savedStudentCode}`)
                }
              >
                ✅ สร้างบัตรตอนนี้
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/dorm-register?student_code=${savedStudentCode}`
                  )
                }
              >
                ⏭️ ไว้ภายหลัง
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}