// src/pages/PatientsPage.js
import React, { useState } from 'react';
import PatientList from '../components/Patients/PatientList';
import PatientForm from '../components/Patients/PatientForm';

function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(old => old + 1);

  return (
    <div>
      <PatientForm
        onPatientSaved={handleRefresh}
        patientToEdit={selectedPatient}
      />
      <PatientList
        onSelect={setSelectedPatient}
        onRefresh={refreshKey}
      />
      {selectedPatient && (
        <div>
          <h3>Detalii pacient</h3>
          <p><strong>ID:</strong> {selectedPatient.id}</p>
          <p><strong>Nume:</strong> {selectedPatient.name}</p>
          <p><strong>Vârstă:</strong> {selectedPatient.age}</p>
          <p><strong>Gen:</strong> {selectedPatient.gender}</p>
        </div>
      )}
    </div>
  );
}

export default PatientsPage;