function CurrencyConvert({ price }) {
  // kalau tidak ada harga
  const storedCurrency = localStorage.getItem("shopoDefaultCurrency");
  const getDefaultCurrency = storedCurrency
    ? JSON.parse(storedCurrency)
    : null;

  if (!price) {
    return getDefaultCurrency
      ? getDefaultCurrency.currency_icon + 0
      : 0;
  }

  // ubah price & rate ke number murni
  const priceNumber = parseFloat(price) || 0;
  const rate = getDefaultCurrency
    ? parseFloat(getDefaultCurrency.currency_rate) || 1
    : 1;

  const priceConverted = priceNumber * rate;

  // cek: ini rupiah atau bukan?
  const isRupiah =
    getDefaultCurrency &&
    getDefaultCurrency.currency_icon &&
    getDefaultCurrency.currency_icon.includes("Rp");

  // FORMAT:
  // - kalau Rupiah -> tanpa desimal, pakai pemisah ribuan Indonesia
  // - kalau bukan Rupiah -> tetap 2 desimal seperti sebelumnya
  const formatted = isRupiah
    ? priceConverted.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : priceConverted.toFixed(2);

  if (getDefaultCurrency) {
    if (getDefaultCurrency.currency_position === "left") {
      return (
        <span className="notranslate">
          {getDefaultCurrency.currency_icon}
          {formatted}
        </span>
      );
    } else {
      return (
        <span className="notranslate">
          {formatted}
          {getDefaultCurrency.currency_icon}
        </span>
      );
    }
  }

  // fallback kalau tidak ada currency di localStorage
  return <span className="notranslate">{formatted}</span>;
}

export default CurrencyConvert;
