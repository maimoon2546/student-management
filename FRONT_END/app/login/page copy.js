'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import LoginLayout from '@/components/LoginLayout';
import RoleSelector from '@/components/RoleSelector';
import LoginForm from '@/components/LoginForm';
import { login } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(username, password, role);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LoginLayout>
      <h2>เข้าสู่ระบบ</h2>
      <p>กรุณากรอกข้อมูลเพื่อเข้าใช้งาน</p>

      <RoleSelector role={role} setRole={setRole} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />

      <footer>© 2025 Ban Loei Soei School</footer>
    </LoginLayout>
  );
}
