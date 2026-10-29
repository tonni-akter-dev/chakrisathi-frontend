/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../../baseApi";

type FaqType = "inspection_request" | "support" | "general";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<any, { type?: FaqType }>({
      query: (params) => ({
        url: "/faqs",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetFaqsQuery } = faqApi;

export default faqApi;
