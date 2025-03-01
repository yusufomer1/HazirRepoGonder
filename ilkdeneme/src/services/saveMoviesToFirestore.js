const TOTAL_PAGES = 20; // Kaç sayfa çekmek istediğinizi belirtin
async function fetchMoviesFromTMDB() {
  try {
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      const TMDB_API_KEY = "b8f574f97271f844d0c4db7c9b4752ac";
      const TMDB_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=${page}`;
      const response = await fetch(TMDB_API_URL);
      const data = await response.json();
      if (!data.results) {
        console.error("Film verileri alınamadı:", data);
        continue; // Hata durumunda bir sonraki sayfaya geç
      }
      const moviesCollection = collection(db, "movies");
      for (const movie of data.results) {
        // Firestore'da mevcut olup olmadığını kontrol et
        const q = query(moviesCollection, where("movie_id", "==", movie.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          console.log(`Film (${movie.title}) zaten veritabanında mevcut.`);
          continue;
        }
        // Film Firestore'da yoksa, veriyi kaydet
        await addDoc(moviesCollection, {
          title: movie.title,
          overview: movie.overview,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          createdAt: new Date(),
          movie_id: movie.id,
        });
        console.log(`Film kaydedildi: ${movie.title}`);
      }
    }
  } catch (error) {
    console.error("TMDB'den veri çekerken hata oluştu:", error);
  }
}

