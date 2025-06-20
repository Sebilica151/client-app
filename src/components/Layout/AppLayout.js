import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AppLayout() {
  const { role, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/dashboard">🏠 Dashboard</Link></li>
          <li><Link to="/chat">💬 Chat</Link></li>

          {role === 1 && <>
            <li><Link to="/patients">👥 Pacienți</Link></li>
            <li><Link to="/medical-records">📄 Fișe medicale</Link></li>
            <li><Link to="/prescriptions">💊 Rețete</Link></li>
          </>}

          {role === 2 && <>
            <li><Link to="/medical-records">📄 Fișele mele</Link></li>
            <li><Link to="/prescriptions">💊 Rețete</Link></li>
          </>}

          {role === 'nurse' && <>
            <li><Link to="/assigned">👩‍⚕️ Pacienți repartizați</Link></li>
          </>}
          <li><Link to="/calendar">📅 Calendar</Link></li>
          <li><Link to="/profile">👤 Profil</Link></li>
          <li><button onClick={logout}>🚪 Logout</button></li>
        </ul>
      </nav>

      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
