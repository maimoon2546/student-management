//dorm-log/page.js 
'use client';

import { useEffect, useState } from 'react';
import '@/styles/dorm-log.css';
import { getDashboardData } from "@/services/dashboardService";

export default function DormLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('out');
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rangeCount, setRangeCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dorm_log`);
        const logsData = await res.json();
        const dashboardData = await getDashboardData();
        setLogs(logsData);
        setData(dashboardData);
      } catch (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredLogs = logs.filter((log) => {
    const expectedDate = log.expected_checkout
      ? new Date(log.expected_checkout).toISOString().split('T')[0] : null;
    if (filter === 'out') return log.check_out_time && !log.check_in_time;
    if (filter === 'expectedDate') return expectedDate === today && log.check_out_time && !log.check_in_time;
    if (filter === 'return') return log.check_out_time && log.check_in_time;
    if (filter === 'overdue') return expectedDate && expectedDate < today && log.check_out_time && !log.check_in_time;
    if (filter === 'range') {
      if (!startDate || !endDate) return false;
      const checkOut = log.check_out_time ? new Date(log.check_out_time) : null;
      const checkIn = log.check_in_time ? new Date(log.check_in_time) : null;
      const start = new Date(startDate);
      const end = new Date(endDate); end.setHours(23, 59, 59, 999);
      return (checkOut && checkOut >= start && checkOut <= end) || (checkIn && checkIn >= start && checkIn <= end);
    }
    return true;
  });

  const stats = {
    out: logs.filter(l => l.check_out_time && !l.check_in_time).length,
    expectedDate: logs.filter(l => {
      const d = l.expected_checkout ? new Date(l.expected_checkout).toISOString().split('T')[0] : null;
      return d === today && l.check_out_time && !l.check_in_time;
    }).length,
    return: logs.filter(l => l.check_out_time && l.check_in_time).length,
    overdue: logs.filter(l => {
      const d = l.expected_checkout ? new Date(l.expected_checkout).toISOString().split('T')[0] : null;
      return d && d < today && l.check_out_time && !l.check_in_time;
    }).length,
    range: logs.filter(l => {
      if (!startDate || !endDate) return false;
      const co = l.check_out_time ? new Date(l.check_out_time) : null;
      const ci = l.check_in_time ? new Date(l.check_in_time) : null;
      const s = new Date(startDate); const e = new Date(endDate); e.setHours(23, 59, 59, 999);
      return (co && co >= s && co <= e) || (ci && ci >= s && ci <= e);
    }).length,
  };

  const handleRangeFilter = () => {
    if (!startDate || !endDate) { alert('กรุณาเลือกช่วงเวลา'); return; }
    const start = new Date(startDate);
    const end = new Date(endDate); end.setHours(23, 59, 59, 999);
    const count = logs.filter(log => {
      const co = log.check_out_time ? new Date(log.check_out_time) : null;
      const ci = log.check_in_time ? new Date(log.check_in_time) : null;
      return (co && co >= start && co <= end) || (ci && ci >= start && ci <= end);
    }).length;
    setRangeCount(count);
  };

  if (loading) {
    return (
      <div className="dorm-log-page">
        <div className="dl-loading-state">
          <div className="dl-spinner"></div>
          <p>⏳ กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dorm-log-page">

      {/* Header */}
      <div className="dl-page-header">
        <div className="dl-header-icon-box">📋</div>
        <div className="dl-header-text">
          <h1 className="dl-header-title">บันทึกการเข้า-ออกหอพัก</h1>
          <p className="dl-header-subtitle">ระบบจัดการเข้า-ออกหอพักนักเรียน</p>
        </div>
        <div className="dl-header-actions">
          <div className="dl-header-actions-row">
            <button className="dl-btn dl-btn-primary" onClick={() => window.location.reload()}>
              <span className="dl-btn-icon">🔄</span>
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dl-stats-grid">
        <div className="dl-stat-card total">
          <div className="dl-stat-icon">📊</div>
          <div className="dl-stat-content">
            <div className="dl-stat-value">{data.inDorm}</div>
            <div className="dl-stat-label">นักเรียนที่อยู่ในหอพักทั้งหมด</div>
          </div>
        </div>
        <div className="dl-stat-card out">
          <div className="dl-stat-icon">🚪</div>
          <div className="dl-stat-content">
            <div className="dl-stat-value">{data.outDormSet}</div>
            <div className="dl-stat-label">อยู่นอกหอพัก</div>
          </div>
        </div>
        <div className="dl-stat-card in">
          <div className="dl-stat-icon">🏠</div>
          <div className="dl-stat-content">
            <div className="dl-stat-value">{data.inDormSet}</div>
            <div className="dl-stat-label">อยู่ในหอพัก</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="dl-filter-section">
        <div className="dl-filter-label">🔍 กรองข้อมูล</div>
        <div className="dl-filter-buttons">
          {[
            { key: 'out', label: `อยู่นอกหอพัก (${stats.out})` },
            { key: 'expectedDate', label: `ครบกำหนดกลับวันนี้ (${stats.expectedDate})` },
            { key: 'return', label: `ประวัติการเข้า / ออกทั้งหมด (${stats.return})` },
            { key: 'range', label: `ประวัติตามช่วงเวลา (${stats.range})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`dl-filter-btn${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Range filter */}
      {filter === 'range' && (
        <div className="dl-range-filter">
          <div className="dl-range-title">📅 เลือกช่วงเวลาที่ต้องการดูประวัติ</div>
          <div className="dl-range-controls">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="dl-date-input" max={endDate || undefined} />
            <span>ถึง</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="dl-date-input" min={startDate || undefined} />
            <button
              className={`dl-range-btn${loading ? ' loading' : ''}`}
              onClick={handleRangeFilter}
              disabled={!startDate || !endDate || loading}
            >
              {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
          </div>
          {rangeCount !== null && (
            <div className={`dl-range-result${rangeCount === 0 ? ' empty' : ''}`}>
              {rangeCount > 0 ? (
                <>
                  📊 พบรายการเข้า-ออกทั้งหมด <b>{rangeCount}</b> รายการ
                  <br />
                  <small style={{ fontSize: '13px', opacity: 0.8 }}>
                    ระหว่างวันที่ {new Date(startDate).toLocaleDateString('th-TH')} – {new Date(endDate).toLocaleDateString('th-TH')}
                  </small>
                </>
              ) : 'ไม่พบรายการในช่วงเวลาที่เลือก'}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="dl-table-container">
        <div className="dl-table-wrapper">
          <table className="dl-table">
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
                  <td colSpan="6" className="dl-empty-state">
                    <span className="dl-empty-icon">📭</span>
                    <span className="dl-empty-text">ไม่มีข้อมูล</span>
                  </td>
                </tr>
              )}
              {filteredLogs.map((log, index) => {
                const fmt = (dt) => dt ? new Date(dt).toLocaleString('th-TH', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }) : null;
                return (
                  <tr key={index}>
                    <td className="dl-row-num">{index + 1}</td>
                    <td className="dl-student-code">
                      <span className="dl-code-badge">{log.student_code}</span>
                    </td>
                    <td className="dl-time-cell">
                      {log.check_out_time ? (
                        <div className="dl-time-info">
                          <span className="dl-time-icon">🚪</span>
                          <span className="dl-time-text">{fmt(log.check_out_time)}</span>
                        </div>
                      ) : <span className="dl-no-data">-</span>}
                    </td>
                    <td className="dl-time-cell">
                      {log.expected_checkout ? (
                        <div className="dl-time-info">
                          <span className="dl-time-icon">📅</span>
                          <span className="dl-time-text">{fmt(log.expected_checkout)}</span>
                        </div>
                      ) : <span className="dl-no-data">-</span>}
                    </td>
                    <td className="dl-time-cell">
                      {log.check_in_time ? (
                        <div className="dl-time-info">
                          <span className="dl-time-icon">✅</span>
                          <span className="dl-time-text">{fmt(log.check_in_time)}</span>
                        </div>
                      ) : <span className="dl-no-data">-</span>}
                    </td>
                    <td className="dl-status-cell">
                      {log.check_out_time && !log.check_in_time ? (
                        <span className="dl-status-badge out">
                          <span className="dl-badge-dot"></span>อยู่นอกหอพัก
                        </span>
                      ) : (
                        <span className="dl-status-badge in">
                          <span className="dl-badge-dot"></span>อยู่ในหอ
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}