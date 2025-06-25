export const API_BASE = 'http://localhost:7219/api';

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
  
  export const getMedicalRecordsByPatientId = async (patientId) => {
    const res = await fetch(`${API_BASE}/MedicalRecords/patient/${patientId}`);
    if (!res.ok) throw new Error('Eroare la preluarea fișelor medicale');
    return res.json();
  };
  
  
  export const createMedicalRecord = async (record) => {
    const res = await fetch(`${API_BASE}/MedicalRecords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Eroare la adăugarea fișei medicale');
    return res.json();
  };

  export const updateMedicalRecord = async (id, record) => {
    const res = await fetch(`${API_BASE}/MedicalRecords/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
  
    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Eroare actualizare fișă medicală: ${res.status} - ${message}`);
    }
  
    return;
  };
  
  export const deleteMedicalRecord = async (id) => {
    const res = await fetch(`${API_BASE}/MedicalRecords/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Eroare la ștergerea fișei');
  };
  
  export const fetchDoctors = async () => {
    const res = await fetch(`${API_BASE}/Doctors`);
    if (!res.ok) throw new Error('Nu s-au putut încărca doctorii');
    return res.json();
  };
  

export const fetchAppointmentsByDoctor = async (doctorId) => {
  const res = await fetch(`${API_BASE}/Appointments/doctor/${doctorId}`);
  if (!res.ok) throw new Error('Eroare la încărcarea programărilor');
  return res.json();
};

export const createAppointment = async (appointment) => {
  const res = await fetch(`${API_BASE}/Appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointment),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Eroare la crearea programării: ${message}`);
  }

  return res.json();
};

export const updateAppointment = async (id, appointment) => {
  console.log("UPDATE PAYLOAD", id, appointment);
  const res = await fetch(`${API_BASE}/Appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment)
  });

  if (!res.ok) throw new Error('Eroare la editarea programării');
  return res;
};

export const deleteAppointment = async (id) => {
  const res = await fetch(`${API_BASE}/Appointments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Eroare la ștergere');
};

export const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return userId ? parseInt(userId) : null;
  } catch (e) {
    console.error("JWT decoding failed:", e);
    return null;
  }
};

export const getCurrentDoctorId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload["DoctorId"] !== undefined ? parseInt(payload["DoctorId"]) : null;
};

export const fetchAppointmentsByDoctorAndDate = async (doctorId, date) => {
  const res = await fetch(`${API_BASE}/Appointments/doctor/${doctorId}?date=${date}`);
  if (!res.ok) throw new Error('Nu s-au putut încărca programările');
  return res.json();
};

// export const fetchProfile = async () => {
//   const headers = getAuthHeaders();
//   console.log(" Headers trimiși:", headers); // 

//   const res = await fetch(`${API_BASE}/Profile`, {
//     method: 'GET',
//     headers,
//   });

//   if (!res.ok) {
//     console.error("Răspuns:", res.status); // 
//     throw new Error("Eroare la preluarea profilului");
//   }

//   return res.json();
// };

// export const updateProfile = async (updatedData) => {
//   const res = await fetch(`${API_BASE}/Profile`, {
//     method: 'PUT',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(updatedData),
//   });

//   if (!res.ok) throw new Error("Eroare la actualizarea profilului");

//   return true;
// };

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const getGlobalMessages = async () => {
  const res = await fetch(`${API_BASE}/messages/global`);
  if (!res.ok) throw new Error("Eroare la încărcarea mesajelor globale");
  return res.json();
};

export const getPrivateMessages = async (user1Id, user2Id) => {
  const res = await fetch(`${API_BASE}/messages/private/${user1Id}/${user2Id}`);
  if (!res.ok) throw new Error("Eroare la încărcarea mesajelor private");
  return res.json();
};

export const sendMessage = async (message) => {
  const res = await fetch(`${API_BASE}/Messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!res.ok) throw new Error('Eroare la trimiterea mesajului');
  return res.json();
};


export const getPrescriptionsByPatientId = async (patientId) => {
  const res = await fetch(`${API_BASE}/Prescriptions/patient/${patientId}`);
  if (!res.ok) throw new Error('Eroare la încărcarea rețetelor');
  return res.json();
};

export const createPrescription = async (data) => {
  const res = await fetch(`${API_BASE}/Prescriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Eroare la crearea rețetei');
  return res.json();
};

export const updatePrescription = async (id, data) => {
  const res = await fetch(`${API_BASE}/Prescriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Eroare la actualizarea rețetei');
};

export const deletePrescription = async (id) => {
  const res = await fetch(`${API_BASE}/Prescriptions/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Eroare la ștergerea rețetei');
};

export async function fetchPrescriptionsByPatientId(patientId) {
  const res = await fetch(`${API_BASE}/Prescriptions/patient/${patientId}`);
  if (!res.ok) throw new Error('Eroare la încărcarea rețetelor');
  return res.json();
}

export const getCurrentPatientId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload JWT:", payload);
    return payload["PatientId"] ? parseInt(payload["PatientId"]) : null;
  } catch {
    return null;
  }
};

export const fetchAppointmentsForPatient = async (patientId) => {
  const res = await fetch(`${API_BASE}/Appointments/patient/${patientId}`);
  if (!res.ok) throw new Error('Eroare la preluarea programărilor pacientului');
  return res.json();
};

export const registerUser = async (userData) => {
  const payload = {
    ...userData,
    role: String(userData.role)  // forțăm string pentru siguranță
  };

  console.log("Payload final:", payload); // DEBUG

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message);
  }

  return res.json();
};

export const fetchProfile = async () => {
  const res = await fetch(`${API_BASE}/Profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Eroare la preluarea profilului");
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_BASE}/Profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Eroare la actualizarea profilului");
  }

  if (res.status === 204) return;

  return res.json();
};

export async function assignPatientToDoctor(patientId, doctorId) {
  console.log("📤 Trimitem assignDoctor:", { doctorId });
  const response = await fetch(`${API_BASE}/users/${patientId}/assign-doctor`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorId })
  });

  console.log(response)

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Eroare la asignare: ${message}`);
  }
}

export async function unassignPatientFromDoctor(patientId) {
  const response = await fetch(`${API_BASE}/users/${patientId}/unassign-doctor`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Eroare la dezasignare: ${message}`);
  }
}

export const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Eroare la preluarea utilizatorilor');
  return res.json();
};

export const archiveMedicalRecord = async (id) => {
  const res = await fetch(`${API_BASE}/MedicalRecords/${id}/archive`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error("Eroare la arhivare fișă medicală");
};

export const getArchivedMedicalRecordsByPatientId = async (patientId) => {
  const res = await fetch(`${API_BASE}/MedicalRecords/patient/${patientId}/archived`);
  if (!res.ok) throw new Error('Eroare la încărcarea fișelor arhivate');
  return res.json();
};
