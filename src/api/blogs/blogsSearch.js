import apiRoutes from "@/appConfig/apiRoutes";
import { notFound } from "next/navigation";

export default async function blogsSearch(searchKey) {
  const res = await fetch(`${apiRoutes.blogs}?search=${searchKey}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
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
