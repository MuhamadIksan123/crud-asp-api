import { createApi } from "@reduxjs/toolkit/query/react";
import type { Pagination } from "../../app/models/pagination";
import { filterEmptyValues } from "../../lib/utils";
import type { CompanyJob } from "../../app/models/companyJob";
import type { CompanyJobParams } from "../../app/models/CompanyJobParams";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const companyJobApi = createApi({
  reducerPath: "companyJobApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["CompanyJob"],
  endpoints: (builder) => ({
    getCompanyJobs: builder.query<
      { items: CompanyJob[]; pagination: Pagination },
      CompanyJobParams | void
    >({
      query: (companyJobParams: CompanyJobParams | void) => ({
        url: "companyJobs",
        params: filterEmptyValues(companyJobParams ?? {}),
      }),
      transformResponse: (items: CompanyJob[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;

        return { items, pagination };
      },
      providesTags: ["CompanyJob"],
    }),
    // Tambahkan endpoint untuk fetch detail job berdasarkan ID
    getCompanyJobById: builder.query<CompanyJob, number>({
      query: (id) => `companyJobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CompanyJob", id }],
    }),
    createCompanyJob: builder.mutation<CompanyJob, FormData>({
      query: (body) => ({
        url: "companyJobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyJob"],
    }),
    updateCompanyJob: builder.mutation<
      CompanyJob,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `companyJobs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CompanyJob"],
    }),
    deleteCompanyJob: builder.mutation<void, number>({
      query: (id) => ({
        url: `companyJobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyJob"],
    }),
  }),
});

export const {
  useGetCompanyJobsQuery,
  useGetCompanyJobByIdQuery,
  useCreateCompanyJobMutation,
  useUpdateCompanyJobMutation,
  useDeleteCompanyJobMutation,
} = companyJobApi;
