import { apiSlice } from "@/redux/api/apiSlice";

export const shippingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShippingDestinations: builder.query({
      query: (data) =>
        `/api/shipping-destinations?city_id=${data.cityId}&token=${data.token}`,
    }),
    cekOngkir: builder.query({
      query: (zip) => `/api/cek-ongkir/${zip}`,
    }),
  }),
});

export const {
  useLazyGetShippingDestinationsQuery,
  useLazyCekOngkirQuery,
} = shippingApi;
