import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- 1. Konfigurasi Awal ---
load_dotenv()
app = Flask(__name__)
# Mengizinkan permintaan dari frontend React Anda (http://localhost:3000)
CORS(app)

# --- 2. Konfigurasi Kunci API Gemini dengan Aman ---
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY tidak ditemukan. Pastikan ada di file .env Anda.")
    genai.configure(api_key=api_key)
    # Buat satu instance model untuk digunakan kembali
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    print("Koneksi ke Google Gemini API berhasil.")
except Exception as e:
    print(f"Error: Gagal mengkonfigurasi Gemini API - {e}")
    model = None

# --- Helper Function ---
def format_currency(amount):
    """Fungsi sederhana untuk memformat mata uang di backend."""
    return f"${amount:,.2f}"

# --- 3. Definisi Endpoint API ---

@app.route('/api/categorize', methods=['POST'])
def categorize_transaction_endpoint():
    if not model: return jsonify({"error": "Model AI tidak terinisialisasi"}), 503
    
    data = request.json
    if not data or 'description' not in data or 'categories' not in data:
        return jsonify({"error": "Input tidak valid"}), 400

    prompt = f'Analyze the transaction description "{data["description"]}" and categorize it into one of the following valid categories: {", ".join(data["categories"])}. Also, provide a confidence score between 0.0 and 1.0 for your categorization.'
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return jsonify(json.loads(response.text))
    except Exception as e:
        print(f"Error di /api/categorize: {e}")
        return jsonify({"category": "Other", "confidence": 0}), 500

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt_endpoint():
    if not model: return jsonify({"error": "Model AI tidak terinisialisasi"}), 503

    data = request.json
    if not data or 'image' not in data or 'mimeType' not in data:
        return jsonify({"error": "Input tidak valid. Butuh 'image' dan 'mimeType'."}), 400

    image_part = {"inline_data": {"mime_type": data['mimeType'], "data": data['image']}}
    prompt = "Extract the merchant name, total amount, and date from this receipt. The date should be in YYYY-MM-DD format. Respond in a single, minified JSON object with keys: 'merchant', 'total', and 'date'."

    try:
        response = model.generate_content(
            [prompt, image_part],
            generation_config={"response_mime_type": "application/json"}
        )
        return jsonify(json.loads(response.text))
    except Exception as e:
        print(f"Error di /api/scan-receipt: {e}")
        return jsonify({"error": "Gagal menganalisis struk"}), 500

@app.route('/api/suggest-goals', methods=['POST'])
def suggest_goals_endpoint():
    if not model: return jsonify({"error": "Model AI tidak terinisialisasi"}), 503

    data = request.json
    if not data or 'income' not in data or 'expenses' not in data or 'balance' not in data:
        return jsonify({"error": "Input tidak valid"}), 400

    prompt = f'A user has a monthly income of ${data["income"]}, expenses of ${data["expenses"]}, and a balance of ${data["balance"]}. Suggest three realistic, personalized savings goals with target amounts. Examples: "Emergency Fund", "Vacation", "New Gadget". Respond in a single, minified JSON object with a single key "goals" which is an array of objects, each with "name" and "targetAmount" keys.'

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return jsonify(json.loads(response.text))
    except Exception as e:
        print(f"Error di /api/suggest-goals: {e}")
        return jsonify({"goals": []}), 500

@app.route('/api/generate-plan', methods=['POST'])
def generate_plan_endpoint():
    if not model: return jsonify({"error": "Model AI tidak terinisialisasi"}), 503

    data = request.json
    # Validasi input yang lebih kompleks
    required_keys = ['goal', 'transactions', 'balance', 'language']
    if not data or not all(key in data for key in required_keys):
        return jsonify({"error": "Input tidak valid, data tidak lengkap"}), 400

    goal = data['goal']
    transactions = data['transactions']
    balance = data['balance']
    language = data['language']

    # Logika yang sama seperti di TS, direplikasi di Python
    recent_transactions_str = "\n".join([
        f"{t['description']}: {format_currency(t['amount'])} in {t['category']}"
        for t in transactions if t.get('type') == 'expense'
    ][:20])

    lang_map = {
        'id': 'Generate the entire plan in Indonesian.',
        'ja': 'Generate the entire plan in Japanese.',
        'en': 'Generate the entire plan in English.'
    }
    language_instruction = lang_map.get(language, 'Generate the entire plan in English.')

    prompt = f"""
A user wants to save for "{goal['name']}" with a target of {format_currency(goal['targetAmount'])}. They have already saved {format_currency(goal['savedAmount'])}.
Their current balance is {format_currency(balance)}.
{language_instruction}

Here are their 20 most recent expense transactions:
{recent_transactions_str}

Generate a custom budget plan in markdown format. The plan MUST be concise and consist of a summary and bullet points under bold headers. **Do not write long paragraphs.**

Follow this structure exactly:

**Summary**
* A brief, encouraging overview and a projected timeline to reach the goal.

**Spending Limits**
* A bulleted list of suggested monthly spending limits for their top 3-4 expense categories.

**Savings Tips**
* A bulleted list of 3 actionable savings tips based on their actual spending habits.

Use ONLY bullet points (*).

{f"This is an updated plan. Their previous plan was:\n{goal['aiPlan']}\nComment on their progress and adjust the new plan, keeping the same format." if goal.get('aiPlan') else ''}
    """

    try:
        response = model.generate_content(prompt)
        # Mengirim kembali teks markdown dalam format JSON
        return jsonify({"plan": response.text})
    except Exception as e:
        print(f"Error di /api/generate-plan: {e}")
        return jsonify({"plan": "Could not generate an AI budget plan. Please try again."}), 500

# --- 4. Jalankan Server ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)