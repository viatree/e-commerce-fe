function CurrencyConvert({ price }) {
  const getDefaultCurrency = JSON.parse(
    localStorage.getItem("shopoDefaultCurrency")
  );
  if (price) {
    const priceTypeConst = parseFloat(price).toFixed(2);
    if (typeof window !== "undefined") {
      if (localStorage.getItem("shopoDefaultCurrency")) {
        const getDefaultCurrency = JSON.parse(
          localStorage.getItem("shopoDefaultCurrency")
        );
        const priceConverted =
          priceTypeConst *
          parseFloat(getDefaultCurrency.currency_rate).toFixed(2);
        if (getDefaultCurrency.currency_position === "left") {
          return (
            <span className="notranslate">{`${
              getDefaultCurrency.currency_icon
            }${priceConverted.toFixed(2)}`}</span>
          );
        } else {
          return (
            <span className="notranslate">{`${priceConverted.toFixed(2)}${
              getDefaultCurrency.currency_icon
            }`}</span>
          );
        }
      }
      return <span className="notranslate">{priceTypeConst}</span>;
    } else {
      return <span className="notranslate">{priceTypeConst}</span>;
    }
  } else {
    return getDefaultCurrency ? getDefaultCurrency?.currency_icon + 0 : 0;
  }
}

export default CurrencyConvert;
