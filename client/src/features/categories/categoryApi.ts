import { createApi } from "@reduxjs/toolkit/query/react";
import type { Category } from "../../app/models/category";
import type { Pagination } from "../../app/models/pagination";
import type { CategoryParams } from "../../app/models/CategoryParams";
import { filterEmptyValues } from "../../lib/utils";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<
      { items: Category[]; pagination: Pagination },
      CategoryParams | void
    >({
      query: (categoryParams) => ({
        url: "categories",
        params: filterEmptyValues(categoryParams ?? {}),
      }),
      transformResponse: (items: Category[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;

        return { items, pagination };
      },
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<Category, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
