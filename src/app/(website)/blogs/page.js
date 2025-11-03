import blogs from "@/api/blogs";
import BlogsComponent from "@/components/Blogs";
import { cache } from "react";

export const getBlogsData = cache(async () => {
  return await blogs();
});

// generate seo metadata
export async function generateMetadata() {
  const data = await getBlogsData();
  const { seoSetting } = data;
  return {
    title: seoSetting?.seo_title,
    description: seoSetting?.seo_description,
  };
}
// main page
export default async function BlogsPage() {
  const data = await getBlogsData();
  return (
    <BlogsComponent
      blogs={data.blogs.data}
      nextPageUrl={data.blogs.next_page_url}
    />
  );
}
