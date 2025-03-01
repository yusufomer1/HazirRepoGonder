import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import './movielist.css';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(db, "movies");
        const snapshot = await getDocs(moviesCollection);
        const moviesData = snapshot.docs.map((doc) => doc.data());
        setMovies(moviesData);
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    fetchMovies();
    return () => unsubscribe();
  }, [navigate]);

  const handleCheckboxChange = (movieTitle) => {
    setSelectedMovies((prevSelectedMovies) => {
      if (prevSelectedMovies.includes(movieTitle)) {
        return prevSelectedMovies.filter((title) => title !== movieTitle);
      } else {
        return [...prevSelectedMovies, movieTitle];
      }
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  return (
    <div className="movies-list-container">
      {user && userData && (
        <div className="header">
          <div className="user-menu-container">
            <FiMoreVertical className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className="dropdown-menu">
                <p className="user-name">{userData.fullName}</p>
                <button onClick={handleProfileClick}>Profile</button>
                <button onClick={handleLogoutClick}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="movies-title">Popüler Filmler</h1>
      <div className="movies-grid">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id={`movie-${index}`}
                  onChange={() => handleCheckboxChange(movie.title)}
                />
                <label htmlFor={`movie-${index}`}>Seç</label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="submit-button">Filmleri Seç</button>
    </div>
  );
};

export default MoviesList;
