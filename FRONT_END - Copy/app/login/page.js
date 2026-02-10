'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import Image from 'next/image';
import '@/styles/login.css';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(username, password);
      localStorage.setItem('staff', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="decorative-circle circle-1"></div>
        <div className="decorative-circle circle-2"></div>

        <div className="left-content">
          <div className="logo-wrapper">
            <Image
              src="/logo.jpg"
              alt="โลโก้โรงเรียน"
              width={80}
              height={80}
              className="school-logo"
            />
          </div>

          <div className="school-info">
            <h2 className="arabic-text">مدرسة الريَّان</h2>
            <h1 className="thai-text">โรงเรียนแสงสวรรค์ศาสตร์</h1>
            <h3 className="subtitle">สถาบันศึกษาปอเนาะพงลือแบ</h3>
            <div className="divider"></div>
            <p className="subtitle">ระบบบริหารการจัดการข้อมูลนักเรียนปอเนาะ</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="form-header">
            <h2>ยินดีต้อนรับ</h2>
            <p className="form-subtitle">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          </div>

          <div className="role-selector">
            <div
              className={`role-card ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <div className="role-icon">⚙️</div>
              <div className="role-text">
                <div className="role-title">ผู้ดูแลหอพัก</div>
              </div>
            </div>
            
            <div
              className={`role-card ${role === 'staff' ? 'active' : ''}`}
              onClick={() => setRole('staff')}
            >
              <div className="role-icon">👤</div>
              <div className="role-text">
                <div className="role-title">ผู้ปกครองนักเรียน</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">ชื่อผู้ใช้</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  className="login-input"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>© 2025 โรงเรียนแสงสวรรค์ศาสตร์</p>
          </div>
        </div>
      </div>
    </div>
  );
}