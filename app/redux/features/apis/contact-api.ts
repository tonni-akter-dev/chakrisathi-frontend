import baseApi from "../../baseApi";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------
    // CREATE Contact
    // -----------------------------
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useCreateContactMutation } = api;
