import baseApi from "../../baseApi";
import { tags } from "../../tags";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📌 LIST SUPPORT TICKETS
    getSupportTickets: builder.query({
      query: ({ per_page = 20 }) => ({
        url: `/support-tickets?per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: [tags.supportTickets],
    }),

    // 📌 CREATE SUPPORT TICKET
    createSupportTicket: builder.mutation({
      query: (data) => ({
        url: `/support-tickets`,
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tags.supportTickets],
    }),

    // 📌 SHOW SINGLE SUPPORT TICKET
    getSupportTicketById: builder.query({
      query: (id) => ({
        url: `/support-tickets/${id}`,
        method: "GET",
      }),
      providesTags: [tags.supportTickets],
    }),

    // 📌 UPDATE SUPPORT TICKET
    updateSupportTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/support-tickets/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tags.supportTickets],
    }),

    // 📌 REPLY TO SUPPORT TICKET
    replyToSupportTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/support-tickets/${id}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tags.supportTickets],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
  useGetSupportTicketByIdQuery,
  useUpdateSupportTicketMutation,
  useReplyToSupportTicketMutation,
} = supportApi;

export default supportApi;
