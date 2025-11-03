"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import PageTitle from "../../Helpers/PageTitle";
import CommentBlog from "./CommentBlog";
import { useRouter } from "next/navigation";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import ServeLangItem from "../../Helpers/ServeLangItem";
import appConfig from "@/appConfig";
import { useSubscribe } from "@/hooks/useSubscribe";
import DateFormat from "@/utils/DateFormat";
import FbIco from "@/components/Helpers/icons/FbIco";
import TwiterIco from "@/components/Helpers/icons/TwiterIco";
import BlogAdminIco from "@/components/Helpers/icons/BlogAdminIco";
import BlogCommentIco from "@/components/Helpers/icons/BlogCommentIco";
import SearchIco from "@/components/Helpers/icons/SearchIco";
import CalendarIco from "@/components/Helpers/icons/CalendarIco";

export default function Blog({ details }) {
  const router = useRouter();
  const blog = details ? details.blog : {};

  // subscribe feature
  const [email, setEmail] = useState("");
  const { subscribeRequest, isLoading: subscribeLoading } = useSubscribe();
  const subscribehandler = async () => {
    if (email) {
      await subscribeRequest(email)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          setEmail("");
        })
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    } else {
      toast.error("Please enter your email");
    }
  };

  // blog search functionality
  const [searchKey, setSearchkey] = useState(null);
  const searchHandler = () => {
    if (searchKey !== "") {
      router.push(`/blog-search?searchKey=${encodeURIComponent(searchKey)}`);
    } else {
      return false;
    }
  };
  return (
    <div className="blog-page-wrapper w-full">
      <div className="title-area mb-[60px]">
        <PageTitle
          title="Blog Details"
          breadcrumb={[
            { name: ServeLangItem()?.home, path: "/" },
            { name: ServeLangItem()?.blogs, path: "/blogs" },
            {
              name: details && details.blog.slug,
              path: `/blogs/blog?slug=${details && details.blog.slug}`,
            },
          ]}
        />
      </div>
      <div className="content-area w-full">
        <div className="container-x mx-auto">
          <div className="blog-article lg:flex lg:space-x-[30px] rtl:space-x-reverse mb-7">
            <div className="flex-1">
              <div className="img w-full h-[457px] relative">
                <Image
                  layout="fill"
                  src={`${appConfig.BASE_URL + details.blog.image}`}
                  alt="blog"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="blog pt-[24px]">
                <div className="short-data flex space-x-9 rtl:space-x-reverse items-center mb-3">
                  <div className="flex space-x-1.5 rtl:space-x-reverse items-center text-qyellow">
                    <span>
                      <BlogAdminIco />
                    </span>
                    <span className="text-base text-qgraytwo capitalize">
                      {ServeLangItem()?.By_Admin}
                    </span>
                  </div>
                  <div className="flex space-x-1.5 rtl:space-x-reverse items-center text-qyellow">
                    <span>
                      <BlogCommentIco />
                    </span>
                    <span className="text-base text-qgraytwo">
                      {details?.activeComments?.data?.length || 0}{" "}
                      {ServeLangItem()?.Comments}
                    </span>
                  </div>
                </div>
                <div className="details">
                  <h1 className="text-[22px] text-qblack font-semibold line-clamp-2 mb-1 capitalize">
                    {details.blog.title}
                  </h1>
                  <div
                    className="mb-10 text-qgraytwo"
                    dangerouslySetInnerHTML={{
                      __html: details.blog.description,
                    }}
                  ></div>
                </div>
              </div>
              <div className="extra-content w-full">
                <div className="w-full h-[1px] bg-[#DCDCDC]"></div>

                <div className="comment-area w-full mt-8">
                  <div className="w-full sm:flex justify-between items-center mb-8">
                    <div className="tags flex space-x-5 rtl:space-x-reverse items-center">
                      <span className="text-2xl text-qblack">Share:</span>
                      <div className="flex space-x-2.5 rtl:space-x-reverse items-center">
                        <FacebookShareButton
                          url={`${
                            typeof window !== "undefined" &&
                            window.location.origin &&
                            window.location.origin +
                              "/blogs/blog?slug=" +
                              details.blog.slug
                          }`}
                          quotes={details.blog.title}
                        >
                          <span className="text-base cursor-pointer text-qyellow flex w-9 h-9 items-center justify-center rounded-full bg-qyellowlow/10">
                            <FbIco fill="currentColor" />
                          </span>
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={`${
                            typeof window !== "undefined" &&
                            window.location.origin &&
                            window.location.origin +
                              "/blogs/blog?slug=" +
                              details.blog.slug
                          }`}
                          title={details.blog.title}
                        >
                          <span className="text-base cursor-pointer text-qyellow flex w-9 h-9 items-center justify-center rounded-full bg-qyellowlow/10">
                            <TwiterIco fill="currentColor" />
                          </span>
                        </TwitterShareButton>
                      </div>
                    </div>
                  </div>
                  <div>
                    <CommentBlog blog={blog && blog} />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[370px] w-full">
              <div
                data-aos="fade-up"
                className="search-widget w-full p-[30px] bg-white mb-[30px]"
              >
                <h1 className="text-[22px] text-qblack font-bold mb-5">
                  {ServeLangItem()?.Search}
                </h1>
                <div className="w-full h-[1px] bg-[#DCDCDC] mb-5"></div>
                <div className="w-full h-[60px] relative">
                  <input
                    value={searchKey || ""}
                    onKeyDown={(e) => e.key === "Enter" && searchHandler()}
                    onChange={(e) => setSearchkey(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="w-full h-full bg-qyellowlow/10 focus:outline-none focus:ring-0 pl-5 pr-16 placeholder:text-qgraytwo"
                  />
                  <button
                    type="button"
                    onClick={searchHandler}
                    className="absolute right-5 top-[17px] text-qyellow"
                  >
                    <SearchIco />
                  </button>
                </div>
              </div>
              <div
                data-aos="fade-up"
                className="latest-post-widget w-full bg-white p-[30px] mb-[30px]"
              >
                <h1 className="text-[22px] text-qblack font-bold mb-5">
                  {ServeLangItem()?.Latest_Post}
                </h1>
                <div className="w-full h-[1px] bg-[#DCDCDC] mb-5"></div>
                <ul className="flex flex-col space-y-5">
                  {details.popularPosts.length > 0 &&
                    details.popularPosts.map((post) => (
                      <li
                        key={post.blog_id}
                        className="flex space-x-5 rtl:space-x-reverse"
                      >
                        <div className="w-[85px] h-[92px]  overflow-hidden rounded relative">
                          <Image
                            layout="fill"
                            src={`${appConfig.BASE_URL + post.blog.image}`}
                            alt="blog"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 h-full flex flex-col justify-between">
                          <Link href={`/blogs/blog?slug=${post.blog.slug}`}>
                            <p className="text-[18px] text-qblack leading-7 cursor-pointer mb-3">
                              {post.blog.title}
                            </p>
                          </Link>
                          <div className="flex space-x-3 rtl:space-x-reverse items-center">
                            <span className="text-qyellow">
                              <CalendarIco />
                            </span>
                            <span className="text-sm text-qgraytwo">
                              {DateFormat(post.created_at)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div
                data-aos="fade-up"
                className="categories-widget w-full bg-white p-[30px] mb-[30px]"
              >
                <h1 className="text-[22px] text-qblack font-bold mb-5">
                  {ServeLangItem()?.Categories}
                </h1>
                <div className="w-full h-[1px] bg-[#DCDCDC] mb-5"></div>
                <ul className="flex flex-col space-y-5">
                  {details.categories.length > 0 &&
                    details.categories.map((category) => (
                      <li
                        key={category.id}
                        className="flex justify-between items-center group"
                      >
                        <Link
                          href={`/category-by-blogs?category=${category.slug}`}
                        >
                          <span className="text-base text-qgraytwo group-hover:text-qyellow cursor-pointer">
                            {category.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div
                data-aos="fade-up"
                className="w-full h-[358px]"
                style={{
                  background: `url(/assets/images/new-letter.jpg) no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                <div className="w-full h-full p-[30px] bg-black bg-opacity-75 flex flex-col justify-between">
                  <div>
                    <h1 className="text-[22px] text-white font-bold mb-5">
                      {ServeLangItem()?.Our_Newsletter}
                    </h1>
                    <div className="w-full h-[1px] bg-[#615B9C] mb-5"></div>
                    <p className="text-base text-white leading-[26px] line-clamp-2">
                      {
                        ServeLangItem()
                          ?.Follow_our_newsletter_to_stay_updated_about_us
                      }
                      .
                    </p>
                  </div>
                  <div>
                    <div className="w-full mb-3.5">
                      <input
                        onChange={(e) => setEmail(e.target.value.trim())}
                        value={email}
                        type="text"
                        className="w-full h-[60px] bg-[#ECEAEC] pl-5 rtl:pr-5 focus:outline-none focus:ring-0 placeholder:text-[#9A9A9A]"
                        placeholder="Enter Your Email Address"
                      />
                    </div>
                    <button
                      onClick={subscribehandler}
                      type="button"
                      className="w-full h-[60px] disabled:cursor-not-allowed"
                      disabled={subscribeLoading}
                    >
                      <span
                        className="yellow-btn w-full h-full"
                        style={{ fontSize: "18px" }}
                      >
                        {ServeLangItem()?.Subscribe}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
