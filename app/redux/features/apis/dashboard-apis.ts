import baseApi from "../../baseApi";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMatrics: builder.query({
      query: (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();

        if (params?.from_date) {
          queryParams.append("from_date", params.from_date);
        }
        if (params?.to_date) {
          queryParams.append("to_date", params.to_date);
        }

        const queryString = queryParams.toString();
        const url = `/dashboard/metrics${queryString ? `?${queryString}` : ""}`;

        return {
          url,
          method: "GET",
        };
      },
    }),
    getMonthlyRevenue: builder.query({
      query: (params) => ({
        url: `/dashboard/revenue/monthly`,
        method: "GET",
        params,
      }),
    }),
    getYearlyRevenue: builder.query({
      query: () => ({
        url: `/dashboard/revenue/yearly`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDashboardMatricsQuery,
  useGetMonthlyRevenueQuery,
  useGetYearlyRevenueQuery,
} = api;
