import baseApi from "../../baseApi";
import { tags } from "../../tags";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews (for a specific user or property)
    getReviews: builder.query({
      query: (params) => ({
        url: "/reviews",
        method: "GET",
        params,
      }),
      providesTags: [tags.reviews],
    }),

    // Create a new review
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        data, 
      }),
      invalidatesTags: [tags.reviews],
    }),

    // Get reviews by property ID
    getPropertyReviewsById: builder.query({
      query: (propertyId) => ({
        url: `/properties/${propertyId}/reviews`,
        method: "GET",
      }),
      providesTags: [tags.reviews],
    }),

    createPropertyReview: builder.mutation({
      query: (data) => ({
        url: "/property-reviews",
        method: "POST",
        data, 
      }),
      invalidatesTags: [tags.reviews],
    }),

    // Update a review
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tags.reviews],
    }),

    // Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.reviews],
    }),

    // Update property review
    updatePropertyReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reviews/property/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tags.reviews],

    }),

    // Delete property review
    deletePropertyReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/property/${id}`,
        method: "DELETE",
      }),
             invalidatesTags: [tags.reviews],
    }),

    // User review endpoints (based on your image showing "User Review")
    getUserReviews: builder.query({
      query: (userId) => ({
        url: `/users/${userId}/reviews`,
        method: "GET",
      }),
       providesTags: [tags.reviews],
    }),

    reviewUser: builder.mutation({
      query: (data) => ({
        url: "/user-reviews",
        method: "POST",
        data,
      }),
       invalidatesTags: [tags.reviews],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useGetPropertyReviewsByIdQuery,
  useCreatePropertyReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useUpdatePropertyReviewMutation,
  useDeletePropertyReviewMutation,
  useGetUserReviewsQuery,
  useReviewUserMutation,
} = api;