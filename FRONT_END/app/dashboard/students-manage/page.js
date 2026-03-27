// app/dashboard/students-manage/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllStudents, getStudentByCode } from '@/services/studentService';
import { getSchoolStudent } from '@/services/school_studentService';
import { updateSchoolStudent } from '@/services/school_studentService';
import '@/styles/students-manage.css';
export default function StudentsManagePage() {

  const router = useRouter();
  const [studentCode, setStudentCode] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [manageError, setManageError] = useState('');
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [mode, setMode] = useState("view"); // view | edit
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('ชาย');
  const [message, setMessage] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');
  const maleCount = studentList.filter(s => s.gender === 'ชาย').length;
  const femaleCount = studentList.filter(s => s.gender === 'หญิง').length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentCode) {
      setMessage('ไม่พบรหัสนักเรียน');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {

      // ✏️ แก้ไขข้อมูลนักเรียน
      await updateSchoolStudent(studentCode, {
        title,
        first_name: firstName,
        last_name: lastName,
        gender,
        birth_date: birthDate,
      });

      setMessage("อัปเดตข้อมูลสำเร็จ");
      setIsSuccess(true);
      setIsEditing(false); // ปิดโหมดแก้ไข

    } catch (err) {

      setMessage(err.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      setIsSuccess(false);

    } finally {
      setIsLoading(false);
    }
  };

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
    const loadStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudentList(data);
        setFilteredStudentList(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();
  }, []);

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
  // รวม filter ข้อความ + เพศ ใน useEffect เดียว
  useEffect(() => {
    let filtered = studentList;

    if (studentCode.trim()) {
      filtered = filtered.filter((s) =>
        s.student_code?.toLowerCase().includes(studentCode.toLowerCase()) ||
        s.first_name?.toLowerCase().includes(studentCode.toLowerCase()) ||
        s.last_name?.toLowerCase().includes(studentCode.toLowerCase())
      );
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter((s) => s.gender === genderFilter);
    }

    setFilteredStudentList(filtered);
  }, [studentCode, genderFilter, studentList]);

  return (
    <>
      {/* Page Header */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">📋</span>
        </div>

        <div>
          <h1 className="page-title-register">จัดการข้อมูลนักเรียน</h1>
          <p className="page-subtitle-register">ข้อมูลนักเรียนทั้งหมด</p>
        </div>
      </div>

      <div className="manage-container">
        {/* Header with Actions */}
        <div className="manage-header">
          <div className="manage-actions">
            <button className="action-btn import-btn">
              <span>📥</span> นำเข้า
            </button>
            <button className="action-btn export-btn">
              <span>📤</span> ส่งออก
            </button>
            <button
              className="action-btn add-btn"

              onClick={() => {
                router.push(
                  `/dashboard/students?generate=true`
                );
              }}
            >
              <span>➕</span> เพิ่มนักเรียน
            </button>
          </div>
        </div>


        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหารหัส, ชื่อ, นามสกุล..."
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </div>
          <button className="search-btn" onClick={handleSearchStudent}>
            ค้นหา
          </button>
          <button
            className="reset-btn"
            onClick={() => {
              setStudentCode('');
              setManageError('');
            }}
          >
            🔄 รีเซ็ต
          </button>
        </div>

        {/* Gender Filter */}
        <div className="gender-filter">
          <div className="gender-filter-inner">
            <button
              className={`filter-btn ${genderFilter === 'all' ? 'active-all' : ''}`}
              onClick={() => setGenderFilter('all')}
            >
              ทั้งหมด
              <span className="filter-count">{studentList.length}</span>
            </button>
            <button
              className={`filter-btn ${genderFilter === 'ชาย' ? 'active-male' : ''}`}
              onClick={() => setGenderFilter('ชาย')}
            >
              👦 ชาย
              <span className="filter-count">{maleCount}</span>
            </button>
            <button
              className={`filter-btn ${genderFilter === 'หญิง' ? 'active-female' : ''}`}
              onClick={() => setGenderFilter('หญิง')}
            >
              👧 หญิง
              <span className="filter-count">{femaleCount}</span>
            </button>
          </div>
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

                  {isEditing ? (
                    <>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "70px" }}
                      />

                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ width: "120px" }}
                      />

                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ width: "120px" }}
                      />
                    </>
                  ) : (
                    `${selectedStudent.title}${selectedStudent.first_name} ${selectedStudent.last_name}`
                  )}

                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">เพศ:</span>
                <span className="detail-value">

                  {isEditing ? (
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                    </select>
                  ) : (
                    selectedStudent.gender
                  )}

                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">วันเกิด:</span>
                <span className="detail-value">

                  {isEditing ? (
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  ) : (
                    selectedStudent?.birth_date
                      ? new Date(selectedStudent.birth_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                      : '-'
                  )}

                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">หอพักปัจจุบัน:</span>
                <span className="detail-value">
                  {selectedStudent?.dorm_name || 'ยังไม่ลงทะเบียนหอพัก'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">ห้องพักปัจจุบัน:</span>
                <span className="detail-value">
                  ห้อง {selectedStudent?.room_number || 'ยังไม่ลงทะเบียนห้องพัก'}
                </span>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>

            <button
              className="action-btn save-btn"
              onClick={(e) => handleSubmit(e)}
            >
              💾 บันทึก
            </button>

            <button
              className="action-btn cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              ❌ ยกเลิก
            </button>

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
                filteredStudentList.map((student) => (
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
                    <td className="birth-date-cell">
                      {student.birth_date ? (
                        <div className="birth-date-wrapper">
                          <span className="date-value">
                            {new Date(student.birth_date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="no-data">-</span>
                      )}
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
                            setMode("view");
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

                            setSelectedStudent(student);

                            setStudentCode(student.student_code);
                            setTitle(student.title);
                            setFirstName(student.first_name);
                            setLastName(student.last_name);
                            setGender(student.gender);
                            setBirthDate(student.birth_date?.slice(0, 10));

                            setMode("edit");
                            setIsEditing(true);

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

                              setStudentList(prev =>
                                prev.filter(s => s.student_code !== student.student_code)
                              );

                              setFilteredStudentList(prev =>
                                prev.filter(s => s.student_code !== student.student_code)
                              );

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
    </>
  );
}