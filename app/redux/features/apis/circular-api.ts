import baseApi from "../../baseApi"; // 💡 আপনার baseApi এর সঠিক পাথ দিন

const circularApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ১. সব সার্কুলার আনা (সার্চ ও ফিল্টার সহ)
    getAllCirculars: builder.query({
      query: (params) => ({
        url: "/circulars",
        method: "GET",
        params, // 💡 params এর ভেতর search, cat, sort ইত্যাদি পাঠানো যাবে
      }),
      providesTags: ["Circular"],
    }),

    // ২. নির্দিষ্ট একটি সার্কুলার আনা (আইডি দিয়ে)
    getSingleCircular: builder.query({
      query: (id) => ({
        url: `/circulars/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Circular", id }],
    }),

    // ৩. নতুন সার্কুলার তৈরি করা (Admin Panel - FormData সহ)
    addCircular: builder.mutation({
      query: (data) => ({
        url: "/circulars",
        method: "POST",
        data, 
        headers: { "Content-Type": "multipart/form-data" } // Axios সাধারণত নিজেই সেট করে নেয়, তবে দরকার হলে দিতে পারেন
      }),
      invalidatesTags: ["Circular"], // নতুন ডাটা আসলে আগের ক্যাশে ক্লিয়ার হবে
    }),

    // ৪. সার্কুলার আপডেট করা (Admin Panel - FormData সহ)
    updateCircular: builder.mutation({
      query: ({ id, data }) => ({
        url: `/circulars/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Circular"]
    }),

    // ৫. সার্কুলার ডিলিট করা (Admin Panel)
    deleteCircular: builder.mutation({
      query: (id) => ({
        url: `/circulars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Circular"],
    }),
  }),
});

export const {
  useGetAllCircularsQuery,
  useGetSingleCircularQuery,
  useAddCircularMutation,
  useUpdateCircularMutation,
  useDeleteCircularMutation,
} = circularApi;

export default circularApi;