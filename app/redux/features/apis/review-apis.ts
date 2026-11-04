import baseApi from "../../baseApi";
import { tags } from "../../tags";

export type Review = {
  _id: string;
  name: string;
  role: string;
  image?: string;
  rating: number;
  text: string;
  status?: "pending" | "approved" | "hidden";
  application?: string;
  applicationId?: string;
  createdAt: string;
};

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // হোমপেজ — অনুমোদিত রিভিউ (লগইন লাগবে না)
    getPublicReviews: builder.query<Review[], void>({
      query: () => ({ url: "/reviews/public", method: "GET" }),
      providesTags: [tags.reviews],
    }),

    // ইউজারের নিজের রিভিউ
    getMyReviews: builder.query<Review[], void>({
      query: () => ({ url: "/reviews/my", method: "GET" }),
      providesTags: [tags.reviews],
    }),

    // রিভিউ দেওয়া
    createReview: builder.mutation<Review, { applicationId: string; rating: number; text: string }>({
      query: (data) => ({ url: "/reviews", method: "POST", data }),
      invalidatesTags: [tags.reviews],
    }),

    // অ্যাডমিন — সব রিভিউ
    getAdminReviews: builder.query<Review[], { status?: string } | void>({
      query: (params) => ({ url: "/reviews/admin", method: "GET", params: params || {} }),
      providesTags: [tags.reviews],
    }),

    // অ্যাডমিন — স্ট্যাটাস বদলানো
    updateReviewStatus: builder.mutation<Review, { id: string; status: "pending" | "approved" | "hidden" }>({
      query: ({ id, status }) => ({ url: `/reviews/admin/${id}`, method: "PATCH", data: { status } }),
      invalidatesTags: [tags.reviews],
    }),

    // অ্যাডমিন — মুছে ফেলা
    deleteReview: builder.mutation<{ msg: string }, string>({
      query: (id) => ({ url: `/reviews/admin/${id}`, method: "DELETE" }),
      invalidatesTags: [tags.reviews],
    }),
  }),
});

export const {
  useGetPublicReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;

export default reviewApi;
