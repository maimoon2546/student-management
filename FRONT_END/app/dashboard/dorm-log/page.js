//dorm-log/page.js
'use client';

import { useEffect, useState } from 'react';
import '@/styles/dorm-log.css';

export default function DormLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in, out

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dorm_log`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'out') return log.check_out_time && !log.check_in_time;
    if (filter === 'in') return log.check_in_time;
    if (filter === 'return') return log.expected_checkout; // ⭐ เพิ่ม
    return true;
  });

  const stats = {
    total: logs.length,
    out: logs.filter(log => log.check_out_time && !log.check_in_time).length,
    in: logs.filter(log => log.check_in_time).length,
    return: logs.filter(log => log.expected_checkout).length // ⭐ เพิ่ม
  };

  if (loading) {
    return (
      <div className="dorm-log-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>⏳ กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dorm-log-page">
      {/* Header Section - Dashboard Style */}
      <div className="page-header-register">
        <div className="header-icon-wrapper">
          <span className="header-icon">📋</span>
        </div>
        <div className="header-text">
          <h1 className="page-title-register">บันทึกการเข้า-ออกหอพัก</h1>
          <p className="page-subtitle-register">ระบบจัดการเข้า-ออกหอพักนักเรียน</p>
        </div>
        <div className="header-actions">
          <div className="header-actions-row">
            {/*<button className="header-btn header-btn-secondary" onClick={() => window.print()}>
              <span className="btn-icon">🖨️</span>
              <span>พิมพ์รายงาน</span>
            </button>*/}
            <button className="header-btn header-btn-primary" onClick={() => window.location.reload()}>
              <span className="btn-icon">🔄</span>
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">รายการทั้งหมด</div>
          </div>
        </div>

        <div className="stat-card out">
          <div className="stat-icon">🚪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.out}</div>
            <div className="stat-label">อยู่นอกหอพัก</div>
          </div>
        </div>

        <div className="stat-card in">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <div className="stat-value">{stats.in}</div>
            <div className="stat-label">อยู่ในหอพัก</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-label">🔍 กรองข้อมูล</div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            ทั้งหมด ({stats.total})
          </button>

          <button
            className={`filter-btn ${filter === 'out' ? 'active' : ''}`}
            onClick={() => setFilter('out')}
          >
            อยู่นอกหอพัก ({stats.out})
          </button>

          <button
            className={`filter-btn ${filter === 'return' ? 'active' : ''}`}
            onClick={() => setFilter('return')}
          >
            กำหนดวันกลับมา ({stats.return})
          </button>

          <button
            className={`filter-btn ${filter === 'in' ? 'active' : ''}`}
            onClick={() => setFilter('in')}
          >
            อยู่ในหอ ({stats.in})
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="dorm-log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>รหัสนักเรียน</th>
                <th>เวลาเช็กเอาต์</th>
                <th>กำหนดวันกลับมา</th>
                <th>เวลาเช็กอิน</th>
                <th>สถานะ</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-text">ไม่มีข้อมูล</div>
                  </td>
                </tr>
              )}

              {filteredLogs.map((log, index) => (
                <tr key={index} className="table-row">
                  <td className="row-number">{index + 1}</td>
                  <td className="student-code">
                    <span className="code-badge">{log.student_code}</span>
                  </td>
                  <td className="time-cell">
                    {log.check_out_time ? (
                      <div className="time-info">
                        <span className="time-icon">🚪</span>
                        <span className="time-text">
                          {new Date(log.check_out_time).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>

                  <td className="time-cell">
                    {log.expected_checkin_out ? (
                      <div className="time-info">
                        <span className="time-icon">📅</span>
                        <span className="time-text">
                          {new Date(log.expected_checkout).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>

                  <td className="time-cell">
                    {log.check_in_time ? (
                      <div className="time-info">
                        <span className="time-icon">✅</span>
                        <span className="time-text">
                          {new Date(log.check_in_time).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>

                  <td className="status-cell">
                    {log.check_out_time ? (
                      <span className="status-badge out">
                        <span className="badge-dot"></span>
                        อยูนอกหอพัก
                      </span>
                    ) : (
                      <span className="status-badge in">
                        <span className="badge-dot"></span>
                        อยู่ในหอ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}