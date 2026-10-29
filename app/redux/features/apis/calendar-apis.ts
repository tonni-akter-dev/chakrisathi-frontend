import baseApi from "../../baseApi";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEntries: builder.query({
      query: (params) => ({
        url: `/calendar/entries`,
        method: "GET",
        params, // for pagination later if needed
      }),
    }),
  }),
});

export const { useGetCalendarEntriesQuery } = api;
