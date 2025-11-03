import blogsSearch from "@/api/blogs/blogsSearch";
import BlogsComponent from "@/components/Blogs";
import { cache } from "react";

export const getBlogsData = cache(async (searchKey) => {
  return await blogsSearch(searchKey);
});

// generate seo metadata
export async function generateMetadata({ searchParams }) {
  const searchParamsObj = await new Promise((resolve) => {
    resolve(searchParams);
  });
  const { searchKey } = searchParamsObj;
  return {
    title: searchKey
      ? `Search Results for "${searchKey}" - Blogs`
      : "Blog Search",
    description: searchKey
      ? `Search results for "${searchKey}" in our blog`
      : "Search our blog posts",
  };
}
// main page
export default async function BlogSearchPage({ searchParams }) {
  const searchParamsObj = await new Promise((resolve) => {
    resolve(searchParams);
  });
  const { searchKey } = searchParamsObj;
  const data = await getBlogsData(searchKey);
  return (
    <BlogsComponent
      blogs={data.blogs.data}
      nextPageUrl={data.blogs.next_page_url}
    />
  );
}
