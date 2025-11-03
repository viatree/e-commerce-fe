import apiRoutes from "@/appConfig/apiRoutes";
import { apiSlice } from "@/redux/api/apiSlice";

export const websiteSetupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDefaultSetup: builder.query({
      query: () => {
        return {
          url: apiRoutes.websiteSetup,
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    subscribeRequest: builder.mutation({
      query: (email) => {
        return {
          url: apiRoutes.subscribeRequest,
          method: "POST",
          body: { email },
        };
      },
    }),
  }),
});

export const { useGetDefaultSetupQuery, useSubscribeRequestMutation } =
  websiteSetupApi;
