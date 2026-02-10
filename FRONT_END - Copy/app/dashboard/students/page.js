'use client';

import { useState } from 'react';
import { createSchool_Student } from '@/services/school_studentService';
import { getSchoolStudent } from '@/services/school_studentService';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function StudentRegisterPage() {
  const router = useRouter();
  const [studentCode, setStudentCode] = useState('');
  const [student, setStudent] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('ชาย');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      await createSchool_Student({
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
        relationship: 'บิดา' // หรือเลือกจาก select ก็ได้
      });


      setMessage('บันทึกข้อมูลสำเร็จ!');
      setIsSuccess(true);

      // Reset form
      setTimeout(() => {
        setStudentCode('');
        setFirstName('');
        setLastName('');
        setGender('ชาย');
        setBirthDate('');
        setTitle('');
        setMessage('');
        setIsSuccess(false);
      }, 2000);

      // หน่วงเล็กน้อย (ถ้าอยากให้เห็นข้อความ)
      setTimeout(() => {
        router.push(`/dashboard/dorm-register?student_code=${studentCode}`);

      }, 1000);

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
        const student = await getSchoolStudent(studentCode);

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

  const [result, setResult] = useState(null);

  const AddStudentPage = async () => {
    setLoading(true);
    setError('');
    try {
      const newStudent = await createSchool_Student({
        student: {
          student_code: studentCode,
          title,
          first_name: firstName,
          last_name: lastName,
          gender
        },
        parent: {
          title: parent.title,
          first_name: parent.firstName,
          last_name: parent.lastName
        },
        relationship: 'บิดา'
      });
      setResult(newStudent.student.student_code);
    }
    catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเพิ่มนักเรียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">👨‍🎓</span>
        </div>
        <div>
          <h1 className="page-title-register">ฟอร์มลงทะเบียนนักเรียนใหม่</h1>
          <p className="page-subtitle-register">กรอกข้อมูลนักเรียนใหม่</p>
        </div>

        <div className="p-6">
          <button
            onClick={AddStudentPage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ เพิ่มนักเรียน
          </button>

          {result && (
            <p className="mt-4 text-green-600">
              ✅ เพิ่มสำเร็จ | รหัสนักเรียน: <b>{result}</b>
            </p>
          )}
        </div>
      </div>

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
                  placeholder="กรอกรหัสนักเรียน (เช่น 0001)"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  required
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
  );
}