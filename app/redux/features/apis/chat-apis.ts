import baseApi from "../../baseApi";
import { tags } from "../../tags";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CHAT =================

    getConversations: builder.query({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      providesTags: [tags.chat],
    }),

    createOrGetConversation: builder.mutation({
      query: ({ other_user_id }) => ({
        url: "/chat/conversations",
        method: "POST",
        data: { other_user_id },
      }),
      invalidatesTags: [tags.chat],
    }),

    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "GET",
      }),
      providesTags: [tags.messages],
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, message, images }) => {
        const formData = new FormData();
        formData.append("message", message);

        if (images?.length) {
          images.forEach((img: string | Blob) =>
            formData.append("images[]", img),
          );
        }
        return {
          url: `/chat/conversations/${conversationId}/messages`,
          method: "POST",
          data: formData,
          contentType: "multipart/form-data",
        };
      },
    }),

    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "POST",
      }),
      invalidatesTags: [tags.chat],
    }),


    
    // =====================================================
    // SUPPORT CHAT
    // =====================================================

    // Get My Support Chat (optional but useful)
    getMySupportChat: builder.query({
      query: () => ({
        url: "/support-chats/me",
        method: "GET",
      }),
      providesTags: [tags.chat],
    }),

    // Get Messages of My Chat
    getSupportMessages: builder.query({
      query: ({ chatId, page = 1 }) => ({
        url: `/support-chats/${chatId}/messages`,
        method: "GET",
        params: { page },
      }),
      providesTags: [tags.supportMessages],
    }),

    // Send Message (TEXT + IMAGE)
    sendSupportMessage: builder.mutation({
      query: ({ message, images }) => {
        const formData = new FormData();

        formData.append("message", message);

        if (images?.length) {
          images.forEach((img: File) => {
            formData.append("images[]", img);
          });
        }

        return {
          url: "/support-chats/me/messages",
          method: "POST",
          data: formData,
          contentType: "multipart/form-data",
        };
      },

      invalidatesTags: [tags.supportMessages],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateOrGetConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetMySupportChatQuery,
  useGetSupportMessagesQuery,
  useSendSupportMessageMutation,
  useMarkAsReadMutation,
} = chatApi;
