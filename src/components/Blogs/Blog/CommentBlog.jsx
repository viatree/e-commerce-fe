"use client";
import { useState } from "react";
import Image from "next/image";
import InputCom from "../../Helpers/InputCom";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";
import ServeLangItem from "../../Helpers/ServeLangItem";
import {
  useBlogCommentApiMutation,
  useBlogDetailsApiQuery,
} from "@/redux/features/blogs/apiSlice";
import { toast } from "react-toastify";

export default function CommentBlog({ blog }) {
  // fetch comments
  const { data: comments, isLoading: commentsLoading } = useBlogDetailsApiQuery(
    blog?.slug
  );

  // blog Comments state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState(null);

  /**
   * blog comment functionality
   * @Initializaing useBlogCommentApiMutation @const blogCommentApi
   * @func blogCommentSuccessHandler @params data, statusCode
   * @func blogCommentErrorHandler @params error
   * @func reviewAction
   */
  const [blogCommentApi, { isLoading: blogCommentLoading }] =
    useBlogCommentApiMutation();

  const blogCommentSuccessHandler = (data, statusCode) => {
    if (statusCode === 200 || statusCode === 201) {
      toast.success(data?.message);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setErrors(null);
    }
  };

  const blogCommentErrorHandler = (error) => {
    if (error?.status === 422) {
      setErrors(error?.data?.errors);
    } else {
      toast.error(error?.data?.message);
    }
  };

  const reviewAction = async () => {
    await blogCommentApi({
      data: {
        name: formData.name,
        email: formData.email,
        comment: formData.message,
        blog_id: blog.id,
      },
      success: blogCommentSuccessHandler,
      error: blogCommentErrorHandler,
    });
  };

  return (
    <>
      <div className="write-review w-full mb-[30px]">
        {/* Form Header */}
        <h1 className="text-2xl font-bold text-qblack mb-5 ">
          {ServeLangItem()?.leave_a_comment}
        </h1>

        {/* Comment Form */}
        <div className="w-full review-form">
          {/* Name and Email Input Fields */}
          <div className="sm:flex sm:space-x-[30px] rtl:space-x-reverse items-center mb-5 w-full">
            {/* Name Input */}
            <div className="w-full mb-5 sm:mb-0">
              <InputCom
                label={ServeLangItem()?.Name + "*"}
                placeholder={ServeLangItem()?.Name}
                type="text"
                name="name"
                inputClasses="h-[50px]"
                value={formData.name}
                inputHandler={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!(errors && Object.hasOwn(errors, "name"))}
              />
              {errors && Object.hasOwn(errors, "name") ? (
                <span className="text-sm mt-1 text-qred">{errors.name[0]}</span>
              ) : (
                ""
              )}
            </div>

            {/* Email Input */}
            <div className="w-full">
              <InputCom
                label={ServeLangItem()?.Email + "*"}
                placeholder={ServeLangItem()?.Email}
                type="email"
                name="email"
                inputClasses="h-[50px]"
                value={formData.email}
                inputHandler={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={!!(errors && Object.hasOwn(errors, "email"))}
              />
              {errors && Object.hasOwn(errors, "email") ? (
                <span className="text-sm mt-1 text-qred">
                  {errors.email[0]}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="w-full mb-[30px]">
            <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2">
              {ServeLangItem()?.Message}*
            </h6>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              name=""
              id=""
              cols="30"
              rows="3"
              className={`w-full placeholder:text-sm border focus:ring-0 focus:outline-none p-6 ${
                errors && Object.hasOwn(errors, "comment")
                  ? "border-qred"
                  : "border-qgray-border"
              }`}
            ></textarea>
            {errors && Object.hasOwn(errors, "comment") ? (
              <span className="text-sm mt-1 text-qred">
                {errors.comment[0]}
              </span>
            ) : (
              ""
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={reviewAction}
              type="button"
              className="black-btn w-[300px] h-[50px] flex justify-center disabled:cursor-not-allowed"
              disabled={blogCommentLoading}
            >
              <span className="flex space-x-1 items-center h-full">
                <span className="text-sm font-semibold">
                  {ServeLangItem()?.Submit_Review}
                </span>
                {/* Loading Spinner */}
                {blogCommentLoading && (
                  <span className="w-5" style={{ transform: "scale(0.3)" }}>
                    <LoaderStyleOne />
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {comments && comments?.activeComments?.data?.length > 0 && (
        <div className="w-full comments">
          {/* Section Divider */}
          <div className="w-full h-[1px] bg-[#DCDCDC]"></div>

          {/* Comments Header */}
          <h1 className="text-2xl font-medium text-qblack my-5">
            {ServeLangItem()?.Comments} (
            {comments?.activeComments?.data?.length || 0})
          </h1>

          {/* Comments List */}
          {comments &&
            comments?.activeComments?.data?.length > 0 &&
            comments?.activeComments?.data?.map((comment, i) => (
              <div
                key={i}
                className="comment-item bg-white px-10 py-[32px] mb-2.5"
              >
                {/* Comment Author Info */}
                <div className="comment-author flex justify-between items-center mb-3">
                  <div className="flex space-x-3 rtl:space-x-reverse items-center">
                    {/* Author Avatar */}
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
                      <Image
                        layout="fill"
                        src={`/assets/images/comment-user-1.png`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Author Name */}
                    <p className="text-[18px] font-medium text-qblack">
                      {comment.name}
                    </p>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="comment mb-[30px]">
                  <p className="text-[15px] text-qgray leading-7 text-normal">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
