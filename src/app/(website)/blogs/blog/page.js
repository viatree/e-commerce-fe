import blogDetails from "@/api/blogs/blogDetails";
import Blog from "@/components/Blogs/Blog";
import { cache } from "react";

export const getBlogDetailsData = cache(async (slug) => {
  return await blogDetails(slug);
});

// generate seo metadata
export async function generateMetadata({ searchParams }) {
  const searchParamsObj = await new Promise((resolve) => {
    resolve(searchParams);
  });
  const slug = searchParamsObj.slug;
  const data = await getBlogDetailsData(slug);
  return {
    title: data?.seoSetting?.seo_title,
    description: data?.seoSetting?.seo_description,
  };
}

// main page
export default async function BlogDetailPage({ searchParams }) {
  const searchParamsObj = await new Promise((resolve) => {
    resolve(searchParams);
  });
  const slug = searchParamsObj.slug;
  const data = await getBlogDetailsData(slug);
  return <Blog details={data} />;
}
