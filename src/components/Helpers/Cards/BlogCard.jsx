import Image from "next/image";
import Link from "next/link";
import ServeLangItem from "../ServeLangItem";
import BlogAdminIco from "../icons/BlogAdminIco";
import BlogComntIco from "../icons/BlogComntIco";
import BlogViewIco from "../icons/BlogViewIco";

export default function BlogCard({ className, datas }) {
  return (
    <div
      className={`blog-card-wrapper w-full border border-[#D3D3D3] ${
        className || ""
      }`}
    >
      {/* Blog image section */}
      <div className="img w-full h-[340px] relative">
        <Image
          layout="fill"
          src={`${datas.picture}`}
          alt={datas.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Blog content section */}
      <div className="p-[24px]">
        {/* Short data: admin and comments */}
        <div className="short-data flex space-x-9 rtl:space-x-reverse items-center mb-3">
          {/* Admin info */}
          <div className="flex space-x-1.5 rtl:space-x-reverse items-center text-qyellow">
            <span>
              <BlogAdminIco />
            </span>
            <span className="text-base text-qgraytwo capitalize">
              {ServeLangItem()?.By_Admin}
            </span>
          </div>
          {/* Comments info */}
          <div className="flex space-x-1.5 rtl:space-x-reverse items-center text-qyellow">
            <span>
              <BlogComntIco />
            </span>
            <span className="text-base text-qgraytwo">
              {datas?.comments_length} {ServeLangItem()?.Comments}
            </span>
          </div>
        </div>
        {/* Blog details: title, article, and view more link */}
        <div className="details">
          {/* Blog title with link */}
          <Link href={`/blogs/blog?slug=${datas.slug}`}>
            <h1 className="text-[22px] text-qblack hover:text-qyellow font-semibold line-clamp-2 mb-1 capitalizen cursor-pointer">
              {datas.title}
            </h1>
          </Link>
          {/* Blog article preview (HTML) */}
          <div
            className="article-area line-clamp-2"
            dangerouslySetInnerHTML={{ __html: datas.article }}
          ></div>
          {/* View more link */}
          <Link href={`/blogs/blog?slug=${datas.slug}`}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
              <span className="text-qblack text-base font-semibold">
                {ServeLangItem()?.View_More}
              </span>
              <span>
                <BlogViewIco />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
