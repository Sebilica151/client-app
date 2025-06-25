import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '2',
    name: '',
    age: '',
    gender: '',
    specialization: '',
    seal: '',
    contactNumber: '',
    patientName: '',
    patientAge: '',
    patientGender: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ['age', 'patientAge'];
    const alwaysStrings = ['role'];

    setForm((prevForm) => ({
      ...prevForm,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : parseInt(value)
        : alwaysStrings.includes(name)
          ? String(value)
          : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: parseInt(form.role),
        ...(form.role === '1'
          ? {
              name: form.name,
              age: parseInt(form.age),
              gender: form.gender,
              specialization: form.specialization,
              seal: form.seal,
              contactNumber: form.contactNumber,
            }
          : {
              patientName: form.patientName,
              patientAge: parseInt(form.patientAge),
              patientGender: form.patientGender,
            }),
      };
      await registerUser(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const isDoctor = form.role === '1';
  const isPatient = form.role === '2';

  return (
    <div className="register-wrapper">
      <form className="register-box" onSubmit={(e) => e.preventDefault()}>
        <h2>Înregistrare</h2>
        {error && <div className="error-message">{error}</div>}

        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Parolă" onChange={handleChange} required />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="2">Pacient</option>
          <option value="1">Doctor</option>
        </select>

        {isDoctor && (
          <>
            <input name="name" placeholder="Nume doctor" onChange={handleChange} required />
            <input name="age" type="number" placeholder="Vârstă" onChange={handleChange} required />
            <input name="gender" placeholder="Gen" onChange={handleChange} required />
            <input name="specialization" placeholder="Specializare" onChange={handleChange} required />
            <input name="seal" placeholder="Parafă" onChange={handleChange} required />
            <input name="contactNumber" placeholder="Telefon" onChange={handleChange} required />
          </>
        )}

        {isPatient && (
          <>
            <input name="patientName" placeholder="Nume pacient" onChange={handleChange} required />
            <input name="patientAge" type="number" placeholder="Vârstă" onChange={handleChange} required />
            <input name="patientGender" placeholder="Gen" onChange={handleChange} required />
          </>
        )}

        <div className="register-actions">
          <button onClick={handleSubmit}>Înregistrează-mă</button>
          <button type="button" className="secondary" onClick={() => navigate('/login')}>
            Înapoi la login
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
