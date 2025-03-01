import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from './firebase'; // Firebase'den auth import et
import { onAuthStateChanged } from "firebase/auth"; // Giriş yapmış kullanıcıyı kontrol et
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/Dashboard';
import MoviesList from './components/MoviesList';
import Profile from './components/Profile'; // Profile bileşenini import et
import RecommendationSystem from './components/RecommendationSystem'; // RecommendationSystem bileşenini import et

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Başlangıçta null olacak, kontrol edilecek
  const [loading, setLoading] = useState(true); // Firebase'den gelen kullanıcı durumunu beklerken loading göstereceğiz
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Kullanıcı giriş yaptıysa true, yapmadıysa false
      setLoading(false); // Firebase'den kullanıcı durumu alındı
    });
    
    return () => unsubscribe();
  }, []);
  
  // Firebase'den yanıt beklenirken loading göster
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <Routes>
        {/* Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
        
        {/* Ana sayfa (MoviesList) sadece kullanıcı giriş yapmışsa görünsün */}
        <Route path="/" element={isAuthenticated ? <MoviesList /> : <Navigate to="/login" />} />
        
        {/* Dashboard, Profile ve RecommendationSystem gibi korunan sayfalar */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/tavsiyesistemi" element={isAuthenticated ? <RecommendationSystem /> : <Navigate to="/login" />} />
        
        {/* Varsayılan olarak login sayfasına yönlendir */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;