'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register } from '@/services/authService';
import Image from 'next/image';
import '@/styles/login.css';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get('redirect');
    const student_code_from_url = redirect?.split('/')[2] || '';

    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('staff');
    const [loginTarget, setLoginTarget] = useState('dashboard');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentCodeInput, setStudentCodeInput] = useState(student_code_from_url);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const student_code = redirect?.split('/')[2];

    // ================= LOGIN =================
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(
                username,
                password,
                role,
                role === 'parent' ? studentCodeInput : null
            );

            if (role === 'staff') {
                localStorage.setItem('staff', JSON.stringify(data.user));
                localStorage.removeItem('parent');
            } else {
                localStorage.setItem('parent', JSON.stringify(data.user));
                localStorage.removeItem('staff');
            }

            if (redirect) {
                router.push(redirect);
                return;
            }

            if (role === 'staff') {
                if (loginTarget === 'dashboard') {
                    router.push('/dashboard');
                } else {
                    router.push('/scan');
                }
            } else {
                router.push('/parent');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ================= REGISTER =================
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await register({
                username: role === 'staff' ? username : null,
                email: role === 'parent' ? username : null,
                first_name,
                last_name,
                password,
                role,
                student_code: role === 'parent' ? studentCodeInput : null
            });

            setSuccess('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
            setMode('login');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ================= CHANGE ROLE =================
    const changeRole = (newRole) => {
        setRole(newRole);
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setError('');
        setSuccess('');

        if (newRole === 'staff') {
            setLoginTarget('dashboard');
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
                        <p className="subtitle">
                            ระบบบริหารการจัดการข้อมูลนักเรียนปอเนาะ
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="login-right">
                <div className="login-form-wrapper">

                    <div className="form-header">
                        <h2>{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
                        <p className="form-subtitle">
                            {mode === 'login'
                                ? 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ'
                                : 'กรอกข้อมูลเพื่อสร้างบัญชีใหม่'}
                        </p>
                    </div>

                    {/* ROLE */}
                    <div className="role-selector">
                        <div
                            className={`role-card ${role === 'staff' ? 'active' : ''}`}
                            onClick={() => changeRole('staff')}
                        >
                            <div className="role-icon">⚙️</div>
                            <div className="role-text">
                                <div className="role-title">ผู้ดูแลหอพัก</div>
                            </div>
                        </div>

                        <div
                            className={`role-card ${role === 'parent' ? 'active' : ''}`}
                            onClick={() => changeRole('parent')}
                        >
                            <div className="role-icon">👤</div>
                            <div className="role-text">
                                <div className="role-title">ผู้ปกครองนักเรียน</div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            ✅ {success}
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={mode === 'login' ? handleLogin : handleRegister}
                        className="login-form"
                    >

                        {/* STAFF REGISTER ONLY */}
                        {mode === 'register' && role === 'staff' && (
                            <>
                                <div className="input-group">
                                    <label>ชื่อ</label>
                                    <input
                                        type="text"
                                        className="login-input"
                                        placeholder="กรอกชื่อ"
                                        value={first_name}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>นามสกุล</label>
                                    <input
                                        type="text"
                                        className="login-input"
                                        placeholder="กรอกนามสกุล"
                                        value={last_name}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* ADD THIS BLOCK */}
                        {mode === 'register' && role === 'parent' && (
                            <div className="input-group">
                                <label>รหัสนักเรียน</label>
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="กรอกรหัสนักเรียน"
                                    value={studentCodeInput}
                                    onChange={(e) => setStudentCodeInput(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label>
                                {role === 'staff' ? 'ชื่อผู้ใช้' : 'อีเมล'}
                            </label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder={
                                    role === 'staff'
                                        ? 'กรอกชื่อผู้ใช้'
                                        : 'กรอกอีเมลผู้ปกครอง'
                                }
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="input-group">
                            <label>รหัสผ่าน</label>
                            <input
                                type="password"
                                className="login-input"
                                placeholder="กรอกรหัสผ่าน"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <button className="login-button" disabled={isLoading}>
                            {isLoading
                                ? 'กำลังดำเนินการ...'
                                : mode === 'login'
                                    ? 'เข้าสู่ระบบ'
                                    : 'สมัครสมาชิก'}
                        </button>
                    </form>


                    {/* SWITCH MODE */}
                    <div className="switch-mode">
                        {mode === 'login' ? (
                            <p>
                                ยังไม่มีบัญชี ?
                                <span
                                    onClick={() => {
                                        setMode('register');
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="link-btn"
                                >
                                    สมัครสมาชิก
                                </span>
                            </p>
                        ) : (
                            <p>
                                มีบัญชีแล้ว ?
                                <span
                                    onClick={() => {
                                        setMode('login');
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="link-btn"
                                >
                                    เข้าสู่ระบบ
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="form-footer">
                        <p>© 2025 โรงเรียนแสงสวรรค์ศาสตร์</p>
                    </div>

                </div>
            </div>
        </div>
    );
}