import baseApi from "../../baseApi";
import { tags } from "../../tags";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query({
      query: ({ per_page = 20 }) => ({
        url: `/reminders?per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: [tags.reminders],
    }),

    getNotifications: builder.query({
      query: ({ per_page = 20 }) => ({
        url: `/notification?per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: [tags.notifications],
    }),

    // COUNTS
    getNotificationCounts: builder.query({
      query: () => ({
        url: `/notification/counts`,
        method: "GET",
      }),
        providesTags: [tags.notifications],
    }),

    // GET ONE
    getNotificationById: builder.query({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "GET",
      }),
        providesTags: [tags.notifications],
    }),

    // MARK AS READ
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/mark-as-read`,
        method: "PATCH",
      }),
      invalidatesTags: [tags.notifications, tags.reminders],
    }),

    markAsUnread: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/mark-as-unread`,
        method: "PATCH",
      }),
      invalidatesTags: [tags.notifications, tags.reminders],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/notification/mark-all-as-read`,
        method: "PATCH",
      }),
      invalidatesTags: [tags.notifications, tags.reminders],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useGetNotificationsQuery,
  useGetNotificationCountsQuery,
  useGetNotificationByIdQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
} = api;

export default api;
