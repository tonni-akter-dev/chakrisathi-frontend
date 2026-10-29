/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../../baseApi";
import { tags } from "../../tags";

const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------------------------
    // 👤 GET WALLET INFO
    // -------------------------
    getWalletInfo: builder.query<any, void>({
      query: () => ({
        url: `/wallets/me`,
        method: "GET",
      }),
      providesTags: [tags.wallet],
    }),

    // -------------------------
    // 💰 GET WALLET BALANCE
    // -------------------------
    getWalletBalance: builder.query<any, void>({
      query: () => ({
        url: `/wallets/balance`,
        method: "GET",
      }),
      providesTags: [tags.wallet],
    }),

    // -------------------------
    // 📝 LIST WALLET TRANSACTIONS
    // -------------------------
    getTransactions: builder.query<any, { per_page?: number }>({
      query: ({ per_page = 20 }) => ({
        url: `/wallets/transactions?per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: [tags.transactions],
    }),

    // -------------------------
    // 🔍 GET SINGLE TRANSACTION
    // -------------------------
    getTransactionById: builder.query<any, string | number>({
      query: (id) => ({
        url: `/wallets/transactions/${id}`,
        method: "GET",
      }),
      providesTags: [tags.transactions],
    }),

    // -------------------------
    // 💸 TRANSFER FUNDS
    // -------------------------
    transferFunds: builder.mutation<any, { to: string; amount: number }>({
      query: (data) => ({
        url: `/wallets/transfer`,
        method: "POST",
        body: data, // ✅ FIXED (was data)
      }),
      invalidatesTags: [tags.wallet, tags.transactions],
    }),

    // -------------------------
    // 💳 DEPOSIT
    // -------------------------
    deposit: builder.mutation<any, { amount: number; currency: string }>({
      query: (data) => ({
        url: `/payment-gateway/deposit`,
        method: "POST",
        data,
      }),
    }),

    // -------------------------
    // 💸 WITHDRAW
    // -------------------------
    withdraw: builder.mutation<
      any,
      { amount: number; currency: string; payment_method_id: number }
    >({
      query: (data) => ({
        url: `/payment-gateway/withdraw`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tags.wallet, tags.transactions],
    }),
  }),
});

export const {
  useGetWalletInfoQuery,
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useTransferFundsMutation,
  useDepositMutation,
  useWithdrawMutation,
} = walletApi;

export default walletApi;
