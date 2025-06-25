// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../services/api";
import ProfileForm from "../components/Profile/ProfileForm";
import "../pages/ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        console.log("Date profil:", response);
        setUserData({
          ...response,
          role: response.Role ?? response.role // normalizează capitalizarea
        });
      } catch (error) {
        console.error("Eroare la încărcarea profilului:", error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    if (["PasswordHash", "Email"].includes(field)) {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      const roleKey = userData?.role === "1" ? "Doctor" : "Patient";
      setUserData((prev) => ({
        ...prev,
        [roleKey]: {
          ...prev[roleKey],
          [field]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(userData);
      setEditing(false);
      alert("Profil actualizat cu succes!");
    } catch (error) {
      console.error("Eroare la actualizare:", error);
    }
  };

  return (
 <div className="profile-page">
  <div className="profile-container">
    <h2>Profilul meu</h2>
    <ProfileForm
      formData={userData}
      onChange={handleChange}
      onSave={handleSave}
      editing={editing}
      setEditing={setEditing}
    />
  </div>
</div>
  );
};

export default ProfilePage;
