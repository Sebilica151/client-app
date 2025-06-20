import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

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
    const alwaysStrings = ['role']; // rolul trebuie forțat string
  
    setForm((prevForm) => ({
      ...prevForm,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : parseInt(value)
        : alwaysStrings.includes(name)
          ? String(value)  // forțăm string explicit
          : value
    }));
    console.log("Payload:", form);
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
    <div>
      <h2>Înregistrare</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Parolă" onChange={handleChange} />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="2">Pacient</option>
        <option value="1">Doctor</option>
      </select>

      {isDoctor && (
        <>
          <input name="name" placeholder="Nume doctor" onChange={handleChange} />
          <input name="age" type="number" placeholder="Vârstă" onChange={handleChange} />
          <input name="gender" placeholder="Gen" onChange={handleChange} />
          <input name="specialization" placeholder="Specializare" onChange={handleChange} />
          <input name="seal" placeholder="Parafă" onChange={handleChange} />
          <input name="contactNumber" placeholder="Telefon" onChange={handleChange} />
        </>
      )}

      {isPatient && (
        <>
          <input name="patientName" placeholder="Nume pacient" onChange={handleChange} />
          <input name="patientAge" type="number" placeholder="Vârstă" onChange={handleChange} />
          <input name="patientGender" placeholder="Gen" onChange={handleChange} />
        </>
      )}

      <button onClick={handleSubmit}>Înregistrează-mă</button>
      <button onClick={() => navigate('/login')}>Înapoi la login</button>
    </div>
  );
}

export default RegisterPage;
