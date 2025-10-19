import { Category, Goal, Transaction } from "../types.ts";

// Alamat backend Python yang berjalan secara lokal.
// Saat deploy, ganti ini dengan URL publik Anda (misal: dari Render.com).
const BACKEND_URL = "https://finplanv3.vercel.app";

// --- Helper untuk mengubah file menjadi Base64 (tetap di frontend) ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

// --- Fungsi yang Memanggil Backend ---

export const categorizeTransaction = async (
  description: string,
  categories: string[]
): Promise<{ category: Category; confidence: number }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, categories }),
    });
    if (!response.ok) throw new Error("Backend response was not ok.");
    return await response.json();
  } catch (error) {
    console.error(
      "Error communicating with backend for categorization:",
      error
    );
    return { category: "Other", confidence: 0 };
  }
};

export const scanReceipt = async (
  imageFile: File
): Promise<{ merchant: string; total: number; date: string }> => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const response = await fetch(`${BACKEND_URL}/api/scan-receipt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image, mimeType: imageFile.type }),
    });
    if (!response.ok) throw new Error("Backend response was not ok.");
    const result = await response.json();
    return {
      merchant: result.merchant || "",
      total: result.total || 0,
      date: result.date || new Date().toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("Error communicating with backend for receipt scan:", error);
    throw new Error("Failed to analyze receipt. Please try again.");
  }
};

export const suggestGoals = async (financialSummary: {
  income: number;
  expenses: number;
  balance: number;
}): Promise<
  Omit<Goal, "id" | "savedAmount" | "isCompleted" | "createdAt">[]
> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/suggest-goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(financialSummary),
    });
    if (!response.ok) throw new Error("Backend response was not ok.");
    const result = await response.json();
    return result.goals || [];
  } catch (error) {
    console.error(
      "Error communicating with backend for goal suggestion:",
      error
    );
    return [];
  }
};

export const generateBudgetPlan = async (
  goal: Goal,
  transactions: Transaction[],
  balance: number,
  language: "en" | "id" | "ja",
  // formatCurrency sekarang tidak lagi dibutuhkan sebagai argumen,
  // karena pemformatan dilakukan di backend.
  // Namun, kita biarkan agar tidak merusak pemanggilan fungsi di komponen lain.
  formatCurrency: (amount: number) => string
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, transactions, balance, language }),
    });
    if (!response.ok) throw new Error("Backend response was not ok.");
    const result = await response.json();
    return result.plan;
  } catch (error) {
    console.error("Error communicating with backend for budget plan:", error);
    return "Could not generate an AI budget plan. Please try again.";
  }
};
