// src/utils/currency.js

/**
 * Mengembalikan nilai yang sudah diconvert (misal Rp) 
 * ke nilai dasar (misal USD) berdasarkan rate di localStorage.
 */
export const revertToPriceBase = (amount) => {
  const storedCurrency = localStorage.getItem("shopoDefaultCurrency");
  
  if (!storedCurrency) return amount;

  try {
    const currencyData = JSON.parse(storedCurrency);
    const rate = parseFloat(currencyData?.currency_rate) || 1;

    // Rumus: Nilai Sekarang / Rate = Nilai Dasar
    // Contoh: 15.000 (Rp) / 15.000 (Rate) = 1 (USD)
    return parseFloat(amount) / rate;
  } catch (error) {
    console.error("Error parsing currency data:", error);
    return amount;
  }
};