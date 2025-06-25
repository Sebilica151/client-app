import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

function AppLayout() {
  const { role, userName, logout } = useAuth();

  const roleText = role === 1 ? 'Doctor' : role === 2 ? 'Pacient' : 'Utilizator';
  const displayName = role === 1 ? `Dr. ${userName}` : userName;

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <div className="nav-content">
          <ul>
            <li>
              <div><strong>Nume:</strong> {displayName}</div>
              <div><strong>Rol:</strong> {roleText}</div>
            </li>

            <li><Link className="nav-link" to="/dashboard">🏠 Dashboard</Link></li>
            <li><Link className="nav-link" to="/chat">💬 Chat</Link></li>

            {role === 1 && <>
              <li><Link className="nav-link" to="/patients">👥 Pacienți</Link></li>
              <li><Link className="nav-link" to="/medical-records">📄 Fișe medicale</Link></li>
              <li><Link className="nav-link" to="/prescriptions">💊 Rețete</Link></li>
            </>}

            {role === 2 && <>
              <li><Link className="nav-link" to="/medical-records">📄 Fișele mele</Link></li>
              <li><Link className="nav-link" to="/prescriptions">💊 Rețete</Link></li>
            </>}

            {role === 'nurse' && (
              <li><Link className="nav-link" to="/assigned">👩‍⚕️ Pacienți repartizați</Link></li>
            )}

            <li><Link className="nav-link" to="/calendar">📅 Calendar</Link></li>
            <li><Link className="nav-link" to="/profile">👤 Profil</Link></li>
          </ul>
        </div>

        <div className="logout-wrapper">
          <button className="logout-button" onClick={logout}>🚪 Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
