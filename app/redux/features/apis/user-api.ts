import baseApi from "../../baseApi";
import { tags } from "../../tags";

// ===== অ্যাডমিন ইউজার ম্যানেজমেন্ট টাইপ =====
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isBlocked?: boolean;
  profileImage?: string;
  createdAt: string;
  applicationCount: number;
};

export type AdminUserList = {
  users: AdminUser[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

export type AdminUserStats = {
  total: number;
  admins: number;
  blocked: number;
  newThisMonth: number;
};

export type AdminUserDetail = {
  user: AdminUser & {
    fatherName?: string;
    motherName?: string;
    dob?: string;
    nid?: string;
    address?: string;
    educationDetails?: {
      degree?: string;
      institution?: string;
      year?: string;
      result?: string;
    }[];
  };
  applications: {
    _id: string;
    applicationId: string;
    circularOrg?: string;
    posts?: { name: string }[];
    status: string;
    paymentStatus?: string;
    amount?: number;
    createdAt: string;
  }[];
};

export type AdminUserQuery = {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
};

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

    // ===== অ্যাডমিন: ইউজার ম্যানেজমেন্ট =====
    getAdminUsers: builder.query<AdminUserList, AdminUserQuery>({
      query: (params) => ({ url: "/users/admin", method: "GET", params }),
      providesTags: [tags.users],
    }),
    getAdminUserStats: builder.query<AdminUserStats, void>({
      query: () => ({ url: "/users/admin/stats", method: "GET" }),
      providesTags: [tags.users],
    }),
    getAdminUserDetail: builder.query<AdminUserDetail, string>({
      query: (id) => ({ url: `/users/admin/${id}`, method: "GET" }),
      providesTags: [tags.users],
    }),
    updateUserRole: builder.mutation<
      { msg: string },
      { id: string; role: "user" | "admin" }
    >({
      query: ({ id, role }) => ({
        url: `/users/admin/${id}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: [tags.users],
    }),
    setUserBlocked: builder.mutation<
      { msg: string },
      { id: string; blocked: boolean }
    >({
      query: ({ id, blocked }) => ({
        url: `/users/admin/${id}/block`,
        method: "PATCH",
        data: { blocked },
      }),
      invalidatesTags: [tags.users],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfileSettingsQuery,
  useUpdateProfileMutation,
  useUpdateProfileSettingsMutation,
  useUploadDocumentsMutation,
  useGetAdminUsersQuery,
  useGetAdminUserStatsQuery,
  useGetAdminUserDetailQuery,
  useUpdateUserRoleMutation,
  useSetUserBlockedMutation,
} = api;
