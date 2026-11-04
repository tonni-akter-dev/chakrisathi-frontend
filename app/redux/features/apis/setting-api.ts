import baseApi from "../../baseApi";
import type { Settings } from "@/utils/types";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/settings
    getSettings: builder.query<Settings, void>({
      query: () => ({ url: "/settings", method: "GET" }),
      providesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery } = settingApi;
export default settingApi;