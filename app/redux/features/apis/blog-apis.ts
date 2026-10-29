/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../../baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<
      any,
      { per_page?: number; page?: number; category?: string }
    >({
      query: ({ per_page = 10 }) => ({
        url: `/blogs?per_page=${per_page}`,
        method: "GET",
      }),
    }),

    getBlogById: builder.query<any, string | number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogByIdQuery } = blogApi;

export default blogApi;
