import { useState, useEffect, useRef } from "react";
import ServeLangItem from "../ServeLangItem";
import appConfig from "@/appConfig";

export default function Selectbox({
  datas = [],
  defaultValue = "",
  className,
  action,
  children,
}) {
  const [item, setItem] = useState({ name: defaultValue });
  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchInputRef = useRef(null);

  // Filter data (aman dari null)
  const filteredDatas = (datas || []).filter((val) =>
    val?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FIX: Autofocus & Clear on Close
  useEffect(() => {
    if (toggle) {
      // PENTING: Gunakan requestAnimationFrame atau timeout 50ms 
      // supaya DOM benar-benar siap render sebelum di-focus
      const focusTimeout = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(focusTimeout);
    } else {
      setSearchTerm("");
      setActiveIndex(-1);
    }
  }, [toggle]);

  const handler = (e, value) => {
    if (e) e.stopPropagation();
    if (action) action(value);
    setItem(value);
    setToggle(false);
  };

  // Keyboard Navigation Logic
  const handleKeyDown = (e) => {
    if (!toggle) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredDatas.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredDatas[activeIndex]) {
          handler(e, filteredDatas[activeIndex]);
        }
        break;
      case "Escape":
        setToggle(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setItem(defaultValue ? { name: defaultValue } : { name: "Select" });
  }, [datas, defaultValue]);

  return (
    <div className={`my-select-box h-full flex items-center cursor-pointer relative ${className || ""}`}>
      <button 
        type="button" 
        className="my-select-box-btn w-full text-left"
        onClick={() => setToggle(!toggle)}
      >
        {children ? children({ item: item?.name }) : <span>{item?.name}</span>}
      </button>

      {toggle && (
        <div className="click-away" onClick={() => setToggle(false)}></div>
      )}

      <div className={`my-select-box-section ${toggle ? "open" : ""}`}>
        <div className="p-2 border-b sticky top-0 bg-white z-[11]">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Cari..."
            className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveIndex(0); 
            }}
            onKeyDown={handleKeyDown} // Pindah ke sini supaya fokus & navigasi satu jalur
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <ul className="list max-h-60 overflow-y-auto">
          <li className="cursor-not-allowed text-gray-400 p-2 text-xs uppercase font-bold">
            {ServeLangItem()?.Select_One || "Select One"}
          </li>

          {filteredDatas.length > 0 ? (
            filteredDatas.map((value, index) => (
              <li
                key={value.id || index}
                className={`${item?.name === value.name ? "selected" : ""} ${
                  activeIndex === index ? "active-highlight" : "" 
                }`}
                onClick={(e) => handler(e, value)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {value.image ? (
                  <div className="flex space-x-5 items-center p-2">
                    <img
                      src={appConfig.BASE_URL + value.image}
                      alt=""
                      className="w-10 h-10 object-cover"
                    />
                    <span>{value.name}</span>
                  </div>
                ) : (
                  <span className="p-2 block">{value.name}</span>
                )}
              </li>
            ))
          ) : (
            <li className="p-2 text-center text-gray-500 text-sm">Data tidak ditemukan</li>
          )}
        </ul>
      </div>
      
      {/* CSS Tambahan internal jika class belum ada */}
      <style jsx>{`
        .active-highlight {
          background-color: #f3f4f6; /* Gray 100 */
          outline: none;
        }
        .selected.active-highlight {
          background-color: #e5e7eb; /* Sedikit lebih gelap jika sudah terpilih */
        }
      `}</style>
    </div>
  );
}