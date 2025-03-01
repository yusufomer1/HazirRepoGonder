import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("C:/Users/LENOVO/OneDrive/Masaüstü/recommendsystem/ilkdeneme/src/firebase_key.json")
firebase_admin.initialize_app(cred)

# Firestore bağlantısı
db = firestore.client()

# CSV'yi oku (DÜZ EĞİK ÇİZGİ İLE)
dataset_path = "C:/Users/LENOVO/Downloads/netflix_titles.csv.csv"
df = pd.read_csv(dataset_path)

# Firestore'a yükle
collection_name = "movies"
for index, row in df.iterrows():
    try:
        doc_ref = db.collection(collection_name).document()
        doc_ref.set(row.to_dict())
        print(f"Film {row['title']} yüklendi!")
    except Exception as e:
        print(f"Hata: {e} (Film: {row['title']})")
