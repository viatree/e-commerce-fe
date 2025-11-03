"use client";
import React, { Suspense } from "react";
import CustomPageCom from "../../../components/CustomPageCom";
import { useSearchParams } from "next/navigation";

function PageWrapContent() {
  const searchParams = useSearchParams();
  const custom = searchParams.get("custom");

  return (
    <>
      <CustomPageCom slug={custom} />
    </>
  );
}

export default function PageWrap() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PageWrapContent />
    </Suspense>
  );
}
