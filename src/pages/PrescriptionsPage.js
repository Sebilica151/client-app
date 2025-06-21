import React, { useEffect, useState } from 'react';
import { getPrescriptionsByPatientId, fetchPatients } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserId, getCurrentPatientId } from '../services/api';

import PrescriptionForm from '../components/Prescriptions/PrescriptionForm';
import PrescriptionList from '../components/Prescriptions/PrescriptionList';
import './PrescriptionsPage.css'; 

function PrescriptionsPage() {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (Number(role) === 1) {
      fetchPatients().then(setPatients);
    } else if (Number(role) === 2) {
      const id = getCurrentPatientId();
      setSelectedPatientId(id);
    }
  }, [role]);

  useEffect(() => {
    if (selectedPatientId) {
      getPrescriptionsByPatientId(selectedPatientId).then(setPrescriptions);
    }
  }, [selectedPatientId, refresh]);

  const handleSaved = () => {
    setEditData(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="prescriptions-container">
      <h2 className="prescriptions-title">Rețete</h2>

      {Number(role) === 1 && (
        <div className="patient-select">
          <label htmlFor="select-pacient">Selectează pacient:</label>
          <select
            id="select-pacient"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Alege pacient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.Id}>
                {p.Name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPatientId && (
        <>
          {Number(role) === 1 && (
            <PrescriptionForm
              patientId={selectedPatientId}
              editData={editData}
              onSaved={handleSaved}
            />
          )}
          <PrescriptionList
            prescriptions={prescriptions}
            onEdit={setEditData}
            onDeleted={handleSaved}
          />
        </>
      )}
    </div>
  );
}

export default PrescriptionsPage;
