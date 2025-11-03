import apiRoutes from "@/appConfig/apiRoutes";
import { notFound } from "next/navigation";

export default async function blogsByCategory(slug) {
  const res = await fetch(`${apiRoutes.blogs}?category=${slug}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  console.log(res);
  if (!res.ok) {
    notFound();
  }
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    notFound();
  }
}
