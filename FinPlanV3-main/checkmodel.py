import os
import google.generativeai as genai
from dotenv import load_dotenv

# Memuat kunci API dari file .env Anda
load_dotenv()

print("Mencoba mengkonfigurasi API key...")
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY tidak ditemukan di file .env.")
    genai.configure(api_key=api_key)
    print("Konfigurasi API key berhasil.")
except Exception as e:
    print(f"GAGAL: Tidak dapat mengkonfigurasi API key. Error: {e}")
    exit() # Keluar dari skrip jika kunci API bermasalah

print("\n===========================================")
print("Mengambil daftar model yang tersedia untuk Anda...")
print("===========================================\n")

try:
    # Loop melalui semua model yang tersedia untuk kunci API Anda
    for model in genai.list_models():
        # Periksa apakah model tersebut mendukung metode 'generateContent'
        if 'generateContent' in model.supported_generation_methods:
            print(f"Model Ditemukan: {model.name}")
            
except Exception as e:
    print(f"GAGAL: Terjadi error saat mengambil daftar model. Error: {e}")
    print("\nSaran: Pastikan 'Generative Language API' atau 'Vertex AI API' telah diaktifkan di proyek Google Cloud Anda.")

print("\n--- Selesai ---")