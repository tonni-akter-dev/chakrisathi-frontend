import { tags } from "./../../tags";
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../../baseApi";

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------------------------
    // 💳 GET PAYMENT GATEWAYS
    // -------------------------
    getGateways: builder.query({
      query: () => ({
        url: `/payment-gateway/gateways`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: tags.payments,
                id,
              })),
              { type: tags.payments, id: "LIST" },
            ]
          : [{ type: tags.payments, id: "LIST" }],
    }),

    // -------------------------
    // 💳 CREATE DEPOSIT VIA EWAY
    // -------------------------
    createDepositEway: builder.mutation({
      query: (data) => ({
        url: `/payment-gateway/deposit`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tags.payments],
    }),

    // -------------------------
    // 💳 WITHDRAW FUNDS
    // -------------------------
    withdraw: builder.mutation({
      query: (data) => ({
        url: `/payment-gateway/withdraw`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tags.payments],
    }),

    // -------------------------
    // 🔄 SYNC WALLET BALANCE
    // -------------------------
    syncWalletBalance: builder.mutation({
      query: (data) => ({
        url: `/wallets/sync`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tags.payments, tags.wallet],
    }),

    // -------------------------
    // 💳 GET PAYMENT METHODS
    // -------------------------
    getPaymentMethods: builder.query({
      query: () => ({
        url: `/payment-gateway/payment-methods`,
        method: "GET",
      }),
      providesTags: [tags.payments],
    }),

    // -------------------------
    // GET MY TRANSACTIONS
    // -------------------------
    getMyTransactions: builder.query<
      any,
      | {
          type?: "deposit" | "withdrawal";
          status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "cancelled";
          per_page?: number;
          page?: number;
        }
      | void
    >({
      query: (paramsArg) => {
        const params = paramsArg ?? {};
        const queryParams = new URLSearchParams();

        if (params.type) queryParams.append("type", params.type);
        if (params.status) queryParams.append("status", params.status);
        queryParams.append("per_page", String(params.per_page || 20));
        if (params.page) queryParams.append("page", String(params.page));

        return {
          url: `/payment-gateway/transactions?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 💰 POST RENT PAYMENT
    // -------------------------
    createRentPayment: builder.mutation({
      query: (data) => ({
        url: `/rent-payments`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tags.payments],
    }),

    // -------------------------
    // 📋 LIST RENT PAYMENTS
    // -------------------------
    listRentPayments: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.property_id)
          queryParams.append("property_id", String(params.property_id));
        if (params.lease_id)
          queryParams.append("lease_id", String(params.lease_id));
        if (params.tenant_id)
          queryParams.append("tenant_id", String(params.tenant_id));
        if (params.status) queryParams.append("status", params.status);
        if (params.payment_date_from)
          queryParams.append("payment_date_from", params.payment_date_from);
        if (params.payment_date_to)
          queryParams.append("payment_date_to", params.payment_date_to);
        queryParams.append("per_page", String(params.per_page || 20));
        queryParams.append("page", String(params.page || 1));

        return {
          url: `/rent-payments?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 🔍 GET RENT PAYMENT
    // -------------------------
    getRentPayment: builder.query<any, string | number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tags.payments, id }],
    }),

    // -------------------------
    // 📄 GET RECEIPT
    // -------------------------
    getReceipt: builder.query<any, string | number>({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/receipt`,
        method: "GET",
      }),
      providesTags: (result, error, paymentId) => [
        { type: tags.payments, id: paymentId },
      ],
    }),

    // -------------------------
    // 📅 GET UPCOMING PAYMENTS
    // -------------------------
    getUpcomingPayments: builder.query<
      any,
      | {
        property_id?: string | number;
        lease_id?: string | number;
        tenant_id?: string | number;
        days_ahead?: number;
        per_page?: number;
        page?: number;
      }
      | void
    >({
      query: (paramsArg) => {
        const params = paramsArg ?? {};
        const queryParams = new URLSearchParams();
        if (params.property_id)
          queryParams.append("property_id", String(params.property_id));
        if (params.lease_id)
          queryParams.append("lease_id", String(params.lease_id));
        if (params.tenant_id)
          queryParams.append("tenant_id", String(params.tenant_id));
        if (params.days_ahead)
          queryParams.append("days_ahead", String(params.days_ahead));
        queryParams.append("per_page", String(params.per_page || 20));
        queryParams.append("page", String(params.page || 1));

        return {
          url: `/rent-payments/upcoming?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 📋 GET PAYMENT SCHEDULES
    // -------------------------
    getPaymentSchedules: builder.query<
      any,
      {
        property_id?: string | number;
        lease_id?: string | number;
        tenant_id?: string | number;
        status?: "active" | "completed" | "cancelled";
        per_page?: number;
        page?: number;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.property_id)
          queryParams.append("property_id", String(params.property_id));
        if (params.lease_id)
          queryParams.append("lease_id", String(params.lease_id));
        if (params.tenant_id)
          queryParams.append("tenant_id", String(params.tenant_id));
        if (params.status) queryParams.append("status", params.status);
        queryParams.append("per_page", String(params.per_page || 20));
        queryParams.append("page", String(params.page || 1));

        return {
          url: `/payments/schedules?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 🗓️ GET CALENDAR PAYMENTS
    // -------------------------
    getCalendarPayments: builder.query<
      any,
      {
        start_date: string;
        end_date: string;
        property_id?: string | number;
        lease_id?: string | number;
        tenant_id?: string | number;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("start_date", params.start_date);
        queryParams.append("end_date", params.end_date);
        if (params.property_id)
          queryParams.append("property_id", String(params.property_id));
        if (params.lease_id)
          queryParams.append("lease_id", String(params.lease_id));
        if (params.tenant_id)
          queryParams.append("tenant_id", String(params.tenant_id));

        return {
          url: `/payments/calendar?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 🔄 UPDATE PAYMENT STATUS
    // -------------------------
    updatePaymentStatus: builder.mutation<
      any,
      {
        id: string | number;
        status: "pending" | "completed" | "failed" | "refunded";
        notes?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tags.payments,
        { type: tags.payments, id },
      ],
    }),

    // -------------------------
    // 💳 PROCESS PAYMENT REFUND
    // -------------------------
    refundPayment: builder.mutation<
      any,
      {
        id: string | number;
        amount?: number;
        reason?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}/refund`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tags.payments,
        { type: tags.payments, id },
      ],
    }),

    // -------------------------
    // 📋 GET PAYMENT SUMMARY
    // -------------------------
    getPaymentSummary: builder.query<
      any,
      {
        property_id?: string | number;
        tenant_id?: string | number;
        year?: number;
        month?: number;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.property_id)
          queryParams.append("property_id", String(params.property_id));
        if (params.tenant_id)
          queryParams.append("tenant_id", String(params.tenant_id));
        if (params.year) queryParams.append("year", String(params.year));
        if (params.month) queryParams.append("month", String(params.month));

        return {
          url: `/payments/summary?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tags.payments],
    }),

    // -------------------------
    // 🗑 DELETE PAYMENT
    // -------------------------
    deletePayment: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.payments],
    }),
  }),
});

export const {
  useCreateRentPaymentMutation,
  useListRentPaymentsQuery,
  useLazyListRentPaymentsQuery,
  useGetRentPaymentQuery,
  useGetReceiptQuery,
  useGetUpcomingPaymentsQuery,
  useGetPaymentSchedulesQuery,
  useGetCalendarPaymentsQuery,
  useUpdatePaymentStatusMutation,
  useRefundPaymentMutation,
  useGetPaymentSummaryQuery,
  useDeletePaymentMutation,
  useGetGatewaysQuery,
  useCreateDepositEwayMutation,
  useWithdrawMutation,
  useSyncWalletBalanceMutation,
  useGetPaymentMethodsQuery,
  useGetMyTransactionsQuery,
} = paymentsApi;

export default paymentsApi;
