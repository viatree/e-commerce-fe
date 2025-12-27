"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ThinBag from "../../../Helpers/icons/ThinBag";
import Middlebar from "./Middlebar";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import appConfig from "@/appConfig";
import FontAwesomeCom from "../../../Helpers/icons/FontAwesomeCom"; // ✅ import sosmed

export default function Header({
  topBarProps,
  drawerAction,
  settings,
  contact,
  languagesApi,
}) {
  const { cart } = useSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (cart?.cartProducts) {
      setCartItems(cart.cartProducts);
    }
  }, [cart]);

  const cartItemsCount = cartItems.length;

  return (
    <header className="header-section-wrapper relative print:hidden">
      <TopBar
        languagesApi={languagesApi}
        topBarProps={topBarProps}
        contact={contact}
        className="quomodo-shop-top-bar"
      />

      <Middlebar
        settings={settings}
        className="quomodo-shop-middle-bar lg:block hidden"
      />

   {/* Mobile Header */}
<div className="quomodo-shop-drawer lg:hidden block w-full h-[60px] bg-white">
  <div className="w-full h-full flex items-center px-5">

    {/* Left: Menu Button */}
    <button onClick={drawerAction} className="p-1 mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </button>

    {/* CENTER FLEX: Logo + Sosmed */}
    <div className="flex-1 flex items-center justify-center space-x-4">

      {/* Logo */}
      <Link href="/">
        {settings && (
          <img
            className="w-[120px] object-contain"
            src={`${appConfig.BASE_URL}${settings.logo}`}
            alt="logo"
          />
        )}
      </Link>

      {/* Sosmed in the center (TikTok + Instagram) */}
      <div className="flex items-center space-x-2">
        <a
          href="https://www.tiktok.com/@rorie.cloud?_r=1&_t=ZS-91qyYCSswXU"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeCom className="w-5 h-5 text-qblack" icon="fab fa-tiktok" />
        </a>

        <a
          href="https://www.instagram.com/rorie.cloud?igsh=b2tja3prejhlaXIy"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeCom className="w-5 h-5 text-qblack" icon="fab fa-instagram" />
        </a>
      </div>
    </div>

    {/* Right: Cart */}
    <div className="cart relative cursor-pointer ml-3">
      <Link href="/cart">
        <ThinBag />
      </Link>
      <span className="w-[18px] h-[18px] rounded-full bg-qyellow absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px]">
        {cartItemsCount}
      </span>
    </div>
  </div>
</div>


      <Navbar className="quomodo-shop-nav-bar lg:block hidden" />
    </header>
  );
}
