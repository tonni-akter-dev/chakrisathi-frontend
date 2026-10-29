/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

type AxiosBaseQueryArgs = {
  baseUrl: string;
};

type QueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  contentType?: string;
  responseType?: AxiosRequestConfig["responseType"];
};

export const axiosBaseQuery =
  ({ baseUrl }: AxiosBaseQueryArgs): BaseQueryFn<QueryArgs, unknown, unknown> =>
  async (
    { url, method, data, params, contentType, headers, responseType },
    api,
  ) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        responseType,
        signal: api.signal,
        headers: {
          ...(contentType ? { "Content-Type": contentType } : {}),
          ...(headers ? headers : {}),
        },
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
