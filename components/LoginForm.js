export default function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="ชื่อผู้ใช้งาน / Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="รหัสผ่าน / Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">เข้าสู่ระบบ →</button>
    </form>
  );
}
