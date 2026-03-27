//app/dashboard/students/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSchoolStudent, updateSchoolStudent, generateStudentCode, getSchoolStudent } from '@/services/school_studentService';
import { getStudentByCode } from '@/services/studentService';
import '@/styles/students-register.css'

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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [manageError, setManageError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedStudentCode, setSavedStudentCode] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const searchParams = useSearchParams();
  const generate = searchParams.get("generate");
  const view = searchParams.get("view");
  const [viewMode, setViewMode] = useState(view || "register");
  const [mode, setMode] = useState("view"); // view | edit
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [parent, setParent] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: 'ชาย',
    phone: '',
    email: '',
    address: '',
    relationship: '',
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
      if (mode === "edit") {

        const result = await updateSchoolStudent(studentCode, {
          title,
          first_name: firstName,
          last_name: lastName,
          gender,
          birth_date: birthDate,
        });

        setMessage("อัปเดตข้อมูลสำเร็จ");
        setIsSuccess(true);

        setTimeout(() => {
          setViewMode("manage");
        }, 800);

        return;
      }
      let imagePath = null;

      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        formData.append("student_code", studentCode);

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/upload/student-profile`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imagePath = data.path;
      }

      const result = await createSchoolStudent({
        student: {
          student_code: studentCode,
          title,
          first_name: firstName,
          last_name: lastName,
          gender,
          birth_date: birthDate,
          path: imagePath
        },
        parent: {
          title: parent.title,
          first_name: parent.firstName,
          last_name: parent.lastName,
          gender: parent.gender,
          phone: parent.phone,
          address: parent.address,
        },
        relationship: parent.gender === 'ชาย' ? 'บิดา' : 'มารดา',
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
    const autoGenerate = async () => {
      if (generate === "true") {
        const { student_code } = await generateStudentCode();
        setStudentCode(student_code);
        setViewMode("register");
      }
    };
    autoGenerate();
  }, [generate]);

  useEffect(() => {

    if (!studentCode.trim()) {
      setFilteredStudentList(studentList);
      return;
    }

    const filtered = studentList.filter((student) =>
      student.student_code?.toLowerCase().includes(studentCode.toLowerCase()) ||
      student.first_name?.toLowerCase().includes(studentCode.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(studentCode.toLowerCase())
    );

    setFilteredStudentList(filtered);

  }, [studentCode, studentList]);

  const handleSearchStudent = async () => {
    if (!studentCode) {
      setManageError('กรุณากรอกรหัสนักเรียน');
      return;
    }

    const student = await getSchoolStudent(studentCode);

    if (!student) {
      setManageError('ไม่พบนักเรียน');
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(student);
    setManageError('');
  };

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setViewMode(view);
    }
  }, [searchParams]);


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
                  กรอกข้อมูลนักเรียน
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

                {/* ══ Profile Image Upload — Custom styled ══ */}
                <div className="form-group">
                  <label className="form-label">รูปโปรไฟล์</label>

                  <div className="file-upload-area" onClick={() => document.getElementById('profileInput').click()}>

                    {previewImage ? (
                      /* มีรูปแล้ว — แสดง preview */
                      <div className="file-preview-container">
                        <img src={previewImage} className="profile-preview" alt="preview" />
                        <div className="file-preview-overlay">
                          <span className="file-preview-text">เปลี่ยนรูป</span>
                        </div>
                      </div>
                    ) : (
                      /* ยังไม่มีรูป — แสดง placeholder */
                      <div className="file-placeholder">
                        <div className="file-placeholder-text">
                          <span className="file-placeholder-title">อัปโหลดรูปโปรไฟล์</span>
                          <span className="file-placeholder-hint">คลิกเพื่อเลือกรูป • JPG, PNG ไม่เกิน 5MB</span>
                        </div>
                        <div className="file-upload-btn">
                          <span>📁</span> เลือกไฟล์
                        </div>
                      </div>
                    )}

                    <input
                      id="profileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setProfileImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }}
                    />
                  </div>

                  {/* ชื่อไฟล์ที่เลือก */}
                  {profileImage && (
                    <div className="file-selected-info">
                      <span className="file-selected-icon">✅</span>
                      <span className="file-selected-name">{profileImage.name}</span>
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileImage(null);
                          setPreviewImage(null);
                        }}
                      >✕</button>
                    </div>
                  )}
                </div>

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
              {studentCode.length === 4 && mode !== "edit" && (
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
                      <span>{mode === "edit" ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}</span>
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