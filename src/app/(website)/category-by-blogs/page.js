import blogsByCategory from "@/api/blogs/blogsByCategory";
import Blogs from "@/components/Blogs";

async function categoryByBlogsPage({ searchParams }) {
  // Convert searchParams to a Promise to handle asynchronously
  const searchParamsObj = await new Promise((resolve) => {
    resolve(searchParams);
  });
  const slug = searchParamsObj.category;
  const { blogs } = await blogsByCategory(slug);
  return <Blogs blogs={blogs.data} />;
}
export default categoryByBlogsPage;
