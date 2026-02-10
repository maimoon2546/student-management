'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/dashboard.css';
import { getDashboardData } from "@/services/dashboardService";
import Image from 'next/image';


export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }


  return (
    <div className="dashboard">

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard ภาพรวม</h1>
            <p className="page-subtitle">ยินดีต้อนรับสู่ระบบจัดการข้อมูลนักเรียน</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="ค้นหา..." />
            </div>
            <button className="notification-btn">
              <span className="bell-icon">🔔</span>
              <span className="badge">3</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">

          <div className="stat-card blue">
            <div className="stat-icon-wrapper blue-bg">
              <span className="stat-icon">👥</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">นักเรียนทั้งหมด</p>
              <h2 className="stat-value">{data.total}</h2>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon-wrapper purple-bg">
              <span className="stat-icon">🏠</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">อยู่หอพัก</p>
              <h2 className="stat-value">{data.inDorm}</h2>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon-wrapper green-bg">
              <span className="stat-icon">✨</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">เข้าใหม่</p>
              <h2 className="stat-value">{data.newThisMonth}</h2> 
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon-wrapper orange-bg">
              <span className="stat-icon">📤</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">ย้ายออก</p>
              <h2 className="stat-value">{data.movedOutThisMonth}</h2>
            </div>
          </div>

        </div>


        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">สถิตินักเรียนแยกตามประเภท</h3>
                <p className="chart-subtitle">ข้อมูลรายเดือนปีการศึกษา 2568</p>
              </div>
              <div className="chart-actions">
                <button className="chart-btn">สัปดาห์</button>
                <button className="chart-btn active">เดือน</button>
                <button className="chart-btn">ปี</button>
              </div>
            </div>
            <div className="chart-body">
              <div className="chart-placeholder">
                <div className="chart-icon">📊</div>
                <p>กราฟแสดงสถิติ</p>
                <small></small>
              </div>
            </div>
          </div>

          <div className="quick-info-card">
            <h3 className="card-title">ข้อมูลหอพัก</h3>
            <div className="quick-info-list">
              <div className="quick-info-item">
                <div className="info-icon-wrapper blue-light">
                  <span>📚</span>
                </div>
                <div className="info-content">
                  <p className="info-label">รายละเอียดหอพัก</p>
                  <h4 className="info-value"></h4>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="info-icon-wrapper purple-light">
                  <span>👨‍🏫</span>
                </div>
                <div className="info-content">
                  <p className="info-label">จำนวนห้องพัก</p>
                  <h4 className="info-value"></h4>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="info-icon-wrapper green-light">
                  <span>🎯</span>
                </div>
                <div className="info-content">
                  <p className="info-label">จำนวนนักเรียนชายที่พักอยู่</p>
                  <h4 className="info-value"></h4>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="info-icon-wrapper orange-light">
                  <span>⭐</span>
                </div>
                <div className="info-content">
                  <p className="info-label">จำนวนนักเรียนหญิงที่พักอยู่</p>
                  <h4 className="info-value"></h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h3 className="section-title">กิจกรรมล่าสุด</h3>
            <a href="#" className="view-all-link">ดูทั้งหมด →</a>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon blue-bg">📝</div>
              <div className="activity-content">
                <p className="activity-text"><strong>นายสมชาย ใจดี</strong> ลงทะเบียนเข้าหอพัก</p>
                <span className="activity-time">5 นาทีที่แล้ว</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon green-bg">✅</div>
              <div className="activity-content">
                <p className="activity-text"><strong>นางสาวสมหญิง รักเรียน</strong> ชำระค่าหอพักเรียบร้อย</p>
                <span className="activity-time">15 นาทีที่แล้ว</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon orange-bg">📤</div>
              <div className="activity-content">
                <p className="activity-text"><strong>นายสมศักดิ์ ขยัน</strong> ยื่นคำร้องย้ายหอพัก</p>
                <span className="activity-time">1 ชั่วโมงที่แล้ว</span>
              </div>
            </div>
          </div>
        </div>

       {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
                  <div className="logo-icon">
                            <Image
                              src="/logo1.png"
                              alt="School Logo"
                              width={40}
                              height={40}
                              className="school-logo"
                              priority
                            />
                          </div>
              <div className="footer-logo-text">
                <h4>โรงเรียนแสงสวรรค์ศาสตร์</h4>
                <p>ระบบจัดการข้อมูลนักเรียนปอเนาะ</p>
              </div>
            </div>
            <p className="footer-description">
              ระบบบริหารจัดการข้อมูลนักเรียนและหอพักแบบครบวงจร 
              เพื่อการบริหารจัดการที่มีประสิทธิภาพ
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h5 className="footer-title">เมนูหลัก</h5>
              <ul className="footer-list">
                <li><a href="/dashboard">แดชบอร์ด</a></li>
                <li><a href="/dashboard/students">ลงทะเบียนนักเรียน</a></li>
                <li><a href="/dashboard/dorm-register">ลงทะเบียนหอพัก</a></li>
                <li><a href="/dashboard/dorm-manage">จัดการหอพัก</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-title">ติดต่อเรา</h5>
              <ul className="footer-list">
                <li>
                  <span className="footer-icon">📍</span>
                  <span>โรงเรียนแสงสวรรค์ศาสตร์</span>
                </li>
                <li>
                  <span className="footer-icon">📞</span>
                  <span>074-xxx-xxx</span>
                </li>
                <li>
                  <span className="footer-icon">📧</span>
                  <span>info@school.ac.th</span>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-title">ข้อมูลระบบ</h5>
              <ul className="footer-list">
                <li>เวอร์ชัน 1.0.0</li>
                <li>อัพเดทล่าสุด: มกราคม 2568</li>
                <li>สถานะ: <span className="status-active">ใช้งานปกติ</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 โรงเรียนแสงสวรรค์ศาสตร์ |
          </p>
          <div className="footer-social">
            <a href="#" className="social-link">🌐</a>
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}