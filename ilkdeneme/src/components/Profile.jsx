import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user || !profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">Profil Bilgileri</h2>
        <img
          src={`/avatars/${profileData.avatar}`} // Avatarı Firestore'dan alıyoruz
          alt="Avatar"
          className="profile-avatar"
        />
        <p>Ad Soyad: {profileData.fullName}</p>
        <p>E-posta: {profileData.email}</p>
      </div>
    </div>
  );
};

export default Profile;
