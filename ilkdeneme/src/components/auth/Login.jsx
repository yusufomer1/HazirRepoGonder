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
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const avatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!selectedAvatar) {
      setError("Lütfen bir avatar seçin.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        avatar: selectedAvatar,
        createdAt: new Date(),
      });

      // Başarı mesajı göster
      setSuccess("Kayıt başarılı! Yönlendiriliyorsunuz...");
      setLoading(false);

      // Kullanıcıyı doğrudan giriş sayfasına yönlendir
      navigate("/login");

    } catch (error) {
      console.error("Kayıt hatası:", error.message);
      setError(error.message);
      setLoading(false);
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

          {/* Avatar Seçim Alanı */}
          <div className="avatar-selection">
            <h3>Avatar Seçin</h3>
            <div className="avatars">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`avatar ${selectedAvatar === avatar ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img
                    src={`/avatars/${avatar}`} // Avatarlar klasöründe saklı olacak
                    alt={`Avatar ${index + 1}`}
                    className="avatar-img"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Kayıt Olunuyor..." : "Hesap Oluştur"}
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