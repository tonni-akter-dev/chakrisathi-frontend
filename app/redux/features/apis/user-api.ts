import baseApi from "../../baseApi";
import { tags } from "../../tags";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET Profile
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: [tags.users],
      keepUnusedDataFor: 0,
    }),
    getProfileSettings: builder.query({
      query: () => ({
        url: "/user/settings",
        method: "GET",
      }),
    }),
    updateProfileSettings: builder.mutation({
      query: ({ data }) => ({
        url: "/user/settings",
        method: "PUT",
        data,
      }),
      invalidatesTags: [tags.users],
    }),
    // UPDATE Profile
    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: "/profile",
        method: "PATCH",
        data,
        contentType:
          typeof FormData !== "undefined" && data instanceof FormData
            ? "multipart/form-data"
            : undefined,
      }),
      invalidatesTags: [tags.users],
    }),

    // In your user-api file
    uploadDocuments: builder.mutation({
      query: (data) => ({
        url: "/user/documents",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfileSettingsQuery,
  useUpdateProfileMutation,
  useUpdateProfileSettingsMutation,
  useUploadDocumentsMutation,
} = api;
