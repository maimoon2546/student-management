'use client';

import '@/styles/dashboard.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('staff');

    if (!stored) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(stored);

    // Guard เฉพาะผู้ดูแล
    if (parsed.role !== 'staff') {
      router.push('/login');
      return;
    }

    setStaff(parsed);
    setLoading(false);
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>กำลังตรวจสอบสิทธิ์...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('staff');
    router.push('/login');
  };

  const menuItems = [
    { icon: '📊', label: 'แดชบอร์ด', path: '/dashboard' },
    { icon: '👨‍🎓', label: 'ลงทะเบียนนักเรียน', path: '/dashboard/students' },
    { icon: '🏠', label: 'ลงทะเบียนเข้าหอพัก', path: '/dashboard/dorm-register' },
    { icon: '⚙️', label: 'จัดการข้อมูลหอพัก', path: '/dashboard/dorm-manage' },
    { icon: '📝', label: 'บันทึกเข้า-ออก', path: '/dashboard/dorm-log' },
    { icon: '🔄', label: 'ย้ายหอพัก', path: '/dashboard/dorm-transfer' },
    { icon: '📤', label: 'ย้ายออก', path: '/dashboard/dorm-exit' }
  ];

  return (
    <div className="dashboard">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
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

            <div className="logo-text">
              <h2>แสงสวรรค์ศาสตร์</h2>
              <p>สถาบันศึกษาปอเนาะพงลือแบ</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <div className="avatar">👤</div>
              <div className="status-dot"></div>
            </div>

            <div className="profile-info">
              <h3>{staff.first_name} {staff.last_name} </h3>
              <p>{staff.role} : ผู้ดูแลหอพัก</p>
              {/*<p>{staff.last_login}</p>*/}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {pathname === item.path && <span className="active-dot"></span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}