import apiRoutes from "@/appConfig/apiRoutes";
import { apiSlice } from "@/redux/api/apiSlice";

export const blogsApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    blogDetailsApi: builder.query({
      query: (slug) => {
        return {
          url: `${apiRoutes.blogs}/${slug}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    // get all blogs next page api
    nextPageBlogsApi: builder.query({
      query: (url) => {
        return {
          url: `${url}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    blogCommentApi: builder.mutation({
      query: (data) => {
        return {
          url: `${apiRoutes.blogComment}`,
          method: "POST",
          body: data.data,
        };
      },
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        try {
          const { data, meta } = await queryFulfilled;
          info.success(data, meta.response.status);
          dispatch(
            apiSlice.util.updateQueryData(
              "blogDetailsApi",
              undefined,
              (draft) => {
                const newData = data?.comment;
                const oldData = JSON.parse(JSON.stringify(draft));
                const updateData = {
                  ...oldData,
                  activeComments: {
                    ...oldData?.activeComments,
                    data: [newData, ...oldData?.activeComments?.data],
                  },
                };
                return (draft = updateData);
              }
            )
          );
        } catch (error) {
          console.log(error);
          info.error(error?.error);
        }
      },
    }),
  }),
});

export const {
  useBlogCommentApiMutation,
  useBlogDetailsApiQuery,
  useLazyNextPageBlogsApiQuery,
} = blogsApis;
