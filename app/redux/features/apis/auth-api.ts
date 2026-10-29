import baseApi from "../../baseApi";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        data, 
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),

    // 💡 ১. প্রোফাইল ডাটা আনার জন্য Query
    getMyProfile: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Profile"], // ক্যাশে ট্যাগ (আপডেট হলে যাতে অটো রিফ্রেশ হয়)
    }),

    // 💡 ২. প্রোফাইল আপডেট করার জন্য Mutation
    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Profile"], // আপডেট হলে আগের ক্যাশে ডিলিট করে নতুন ডাটা আনবে
    }),

    sendVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/send-verification-code",
        method: "POST",
        data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        data,
      }),
    }),

    logout: builder.mutation({
      query: (data) => ({
        url: "/logout",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMyProfileQuery,    // 💡 নতুন হুক
  useUpdateMyProfileMutation, // 💡 নতুন হুক
  useSendVerificationCodeMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = api;

export default api;