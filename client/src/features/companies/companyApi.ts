import { createApi } from "@reduxjs/toolkit/query/react";
import type { Pagination } from "../../app/models/pagination";
import { filterEmptyValues } from "../../lib/utils";
import type { Company } from "../../app/models/company";
import type { CompanyParams } from "../../app/models/CompanyParams";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getCompanies: builder.query<
      { items: Company[]; pagination: Pagination },
      CompanyParams | void
    >({
      query: (companyParams) => ({
        url: "companies",
        params: filterEmptyValues(companyParams ?? {}),
      }),
      transformResponse: (items: Company[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;

        return { items, pagination };
      },
      providesTags: ["Company"],
    }),
    getCompanyById: builder.query<Company, number>({
      query: (id) => `companies/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Company", id }],
    }),
    createCompany: builder.mutation<Company, FormData>({
      query: (body) => ({
        url: "companies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation<Company, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `companies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Company"],
    }),
    deleteCompany: builder.mutation<void, number>({
      query: (id) => ({
        url: `companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
