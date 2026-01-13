import { apiSlice } from "@/redux/api/apiSlice";

export const shippingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShippingDestinations: builder.query({
      query: (cityId) =>
        `/shipping-destinations?city_id=${cityId}`,
    }),
    cekOngkir: builder.query({
      query: (zip) => `/cek-ongkir/${zip}`,
    }),
  }),
});

export const {
  useLazyGetShippingDestinationsQuery ,
  useLazyCekOngkirQuery,
} = shippingApi;
