import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios/axiosBaseQuery";
import { tagsArray } from "./tags";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL as string}/api/v1`,
  }),

  tagTypes: tagsArray,
  endpoints: () => ({}),
  
});

export default baseApi;
