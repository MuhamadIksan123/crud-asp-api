import { configureStore } from "@reduxjs/toolkit/react";
import { categoryApi } from "../../features/categories/categoryApi";
import { useDispatch, useSelector } from "react-redux";
import { companyApi } from "../../features/companies/companyApi";
import { companyJobApi } from "../../features/companyJobs/companyJobApi";

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [companyJobApi.reducerPath]: companyJobApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(companyApi.middleware)
      .concat(companyJobApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
