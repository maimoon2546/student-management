export default function RoleSelector({ role, setRole }) {
  return (
    <div className="role-container">
      <div
        className={`role-card ${role === 'staff' ? 'active' : ''}`}
        onClick={() => setRole('staff')}
      >
        👤 บุคลากร {role === 'staff' && '✔'}
      </div>

      <div
        className={`role-card ${role === 'admin' ? 'active' : ''}`}
        onClick={() => setRole('admin')}
      >
        ⚙ ผู้ดูแลระบบ {role === 'admin' && '✔'}
      </div>
    </div>
  );
}
