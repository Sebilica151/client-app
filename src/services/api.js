const API_BASE = 'http://localhost:5020/api';

export const fetchPatients = async () => {
  const res = await fetch(`${API_BASE}/Patients`);
  if (!res.ok) throw new Error('Eroare la preluarea pacienților');
  return res.json();
};

export const createPatient = async (patient) => {
  const res = await fetch(`${API_BASE}/Patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  });
  if (!res.ok) throw new Error('Eroare la crearea pacientului');
  return res.json();
};

export const updatePatient = async (id, patient) => {
    const res = await fetch(`${API_BASE}/Patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!res.ok) throw new Error('Eroare la actualizarea pacientului');
  };
  
  export const deletePatient = async (id) => {
    const res = await fetch(`${API_BASE}/Patients/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Eroare la ștergerea pacientului');
  };
  