// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/dashboard.css';
import { getDashboardData } from "@/services/dashboardService";
import Image from 'next/image';
import DormBarChart from "@/components/Chart";
import DormBarChart2 from "@/components/DormChart";
import NotificationBell from '@/components/NotificationBell';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "ทั้งหมด",
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear);

  useEffect(() => {
    const staff = localStorage.getItem('staff');
    if (!staff) {
      router.push('/login');
    }
  }, []);

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

            <NotificationBell />

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
              <p className="stat-label">คน</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon-wrapper purple-bg">
              <span className="stat-icon">🏠</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">นักเรียนอยู่ในหอพัก</p>
              <h2 className="stat-value">{data.inDormSet}</h2>
              <p className="stat-label">คน</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon-wrapper orange-bg">
              <span className="stat-icon">📤</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">นักเรียนที่อยู่นอกหอพัก</p>
              <h2 className="stat-value">{data.outDormSet}</h2>
              <p className="stat-label">คน</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon-wrapper green-bg">
              <span className="stat-icon">✨</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">นักเรียนเข้าใหม่ในเดือนนี้</p>
              <h2 className="stat-value">{data.newThisMonth}</h2>
              <p className="stat-label">คน</p>
            </div>
          </div>

        </div>


        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-grid">
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">สถิติการกลับบ้านของนักเรียนในแต่ละเดือน</h3>
                  <p className="chart-subtitle">จำนวนครั้งที่นักเรียนออกจากหอพักในแต่ละเดือน</p>
                </div>
              </div>

              <div className="chart-body">
                <DormBarChart year={year} month={month} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">สถิติของนักเรียนที่อาศัยในแต่ละหอพัก</h3>
                  <p className="chart-subtitle">จำนวนนักเรียนที่พักอยู่ในหอพักปัจจุบัน</p>
                </div>
              </div>

              <div className="chart-body">
                <DormBarChart2 year={year} month={month} />
              </div>
            </div>
          </div>
        </div>

        <div className="quick-info-card">
          <h3 className="card-title">กฎระเบียบหอพัก</h3>

          <div className="quick-info-list">

            <div className="quick-info-item">
              <div className="info-icon-wrapper blue-light">
                <span>🏠</span>
              </div>
              <div className="info-content">
                <p className="info-label">กฎหอพักชาย</p>
                <h4 className="info-value">ห้ามออกนอกหอหลัง 21:00 น.</h4>
              </div>
            </div>

            <div className="quick-info-item">
              <div className="info-icon-wrapper purple-light">
                <span>🏠</span>
              </div>
              <div className="info-content">
                <p className="info-label">กฎหอพักหญิง</p>
                <h4 className="info-value">ห้ามออกนอกหอหลัง 20:00 น.</h4>
              </div>
            </div>

            <div className="quick-info-item">
              <div className="info-icon-wrapper green-light">
                <span>📌</span>
              </div>
              <div className="info-content">
                <p className="info-label">ข้อปฏิบัติ</p>
                <h4 className="info-value">ต้องสแกนบัตรก่อนเข้า - ออกหอทุกครั้ง เมื่อมีการกลับบ้าน</h4>
              </div>
            </div>

            <div className="quick-info-item">
              <div className="info-icon-wrapper orange-light">
                <span>⚠️</span>
              </div>
              <div className="info-content">
                <p className="info-label">บทลงโทษ</p>
                <h4 className="info-value">ไม่สแกนบัตรเข้า - ออกหอ มีการตักเตือน</h4>
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