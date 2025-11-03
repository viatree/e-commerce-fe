"use client";
import BlogCard from "../Helpers/Cards/BlogCard";
import DataIteration from "../Helpers/DataIteration";
import PageTitle from "../Helpers/PageTitle";
import React, { useEffect, useState } from "react";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import ServeLangItem from "../Helpers/ServeLangItem";
import appConfig from "@/appConfig";
import { useLazyNextPageBlogsApiQuery } from "@/redux/features/blogs/apiSlice";

export default function Blogs({ blogs, nextPageUrl }) {
  const [getBlogs, setGetBlogs] = useState([]);
  const [nxtPage, setNxtPage] = useState(nextPageUrl);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const rs = blogs.map((item) => {
        return {
          id: item.id,
          by: item.admin_id,
          comments_length: item.active_comments.length,
          title: item.title,
          article: item.description,
          picture: appConfig.BASE_URL + item.image,
          slug: item.slug,
        };
      });
      setGetBlogs(rs);
    } else {
      setGetBlogs([]);
    }
  }, [blogs]);

  /**
   * Load next page of blogs
   */
  const [nextPageBlogsApi, { isLoading: isLoadingNextPageBlogsApi }] =
    useLazyNextPageBlogsApiQuery();

  const nextPageHandler = async () => {
    if (!nxtPage || nxtPage === "null") {
      return false;
    }
    const fetchBlogs = async (url) => {
      const blogs = await nextPageBlogsApi(url).unwrap();
      const blogsData = blogs?.blogs?.data;
      if (blogsData && blogsData?.length > 0) {
        const newBlogs = blogsData.map((item) => {
          return {
            id: item.id,
            by: item.admin_id,
            comments_length: item.active_comments.length,
            title: item.title,
            article: item.description,
            picture: appConfig.BASE_URL + item.image,
            slug: item.slug,
          };
        });
        setGetBlogs((prev) => [...prev, ...newBlogs]);
        setNxtPage(blogs?.blogs?.next_page_url);
      }
    };
    fetchBlogs(nxtPage);
  };
  return (
    <div className="blog-page-wrapper w-full">
      <div className="blogs-wrapper w-full">
        <div className="title-bar">
          <PageTitle
            title="Blogs"
            breadcrumb={[
              { name: ServeLangItem()?.home, path: "/" },
              { name: ServeLangItem()?.blogs, path: "/blogs" },
            ]}
          />
        </div>
      </div>

      <div className="w-full py-[60px] bg-white">
        <div className="container-x mx-auto">
          <div className="w-full">
            {getBlogs && getBlogs.length > 0 ? (
              <>
                <div
                  className={`grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5 ${
                    nextPageUrl ? "pb-[60px]" : ""
                  }`}
                >
                  <DataIteration
                    datas={getBlogs}
                    startLength={0}
                    endLength={getBlogs.length}
                  >
                    {({ datas }) => (
                      <div
                        data-aos="fade-up"
                        key={datas.id}
                        className="item w-full"
                      >
                        <BlogCard datas={datas} />
                      </div>
                    )}
                  </DataIteration>
                </div>
                {nxtPage && nxtPage !== "null" && (
                  <div className="flex justify-center">
                    <button
                      onClick={nextPageHandler}
                      type="button"
                      className="w-[180px] h-[54px] bg-qyellow rounded"
                    >
                      <div className="flex justify-center w-full h-full items-center group rounded relative transition-all duration-300 ease-in-out overflow-hidden cursor-pointer">
                        <div className="flex items-center transition-all duration-300 ease-in-out relative z-10  text-qblack group-hover:text-white">
                          <span className="text-sm font-600 tracking-wide leading-7 mr-2">
                            {ServeLangItem()?.Show_more}...
                          </span>
                          {isLoadingNextPageBlogsApi && (
                            <span
                              className="w-5 "
                              style={{ transform: "scale(0.3)" }}
                            >
                              <LoaderStyleOne />
                            </span>
                          )}
                        </div>
                        <div
                          style={{ transition: `transform 0.25s ease-in-out` }}
                          className="w-full h-full bg-black absolute top-0 left-0 right-0 bottom-0 transform scale-x-0 group-hover:scale-x-100 origin-[center_left] group-hover:origin-[center_right]"
                        ></div>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-center mt-10">
                  <p className="text-lg font-medium tracking-wide">
                    {ServeLangItem()?.Blog_Not_Found}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
