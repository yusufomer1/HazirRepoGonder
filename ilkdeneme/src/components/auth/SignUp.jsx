import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          email,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("Firestore'a ekleme hatası:", dbError.message);
      }

      setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Kayıt Ol</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Şifre (en az 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">
            Hesap Oluştur
          </button>
        </form>
        <p className="signup-footer">
          Zaten hesabınız var mı?{" "}
          <Link to="/login" className="signup-link">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
