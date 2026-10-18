import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import CategoryPage from "../../features/categories/CategoryPage";
import CategoryForm from "../../features/categories/CategoryForm";
import CompanyPage from "../../features/companies/CompanyPage";
import CompanyForm from "../../features/companies/CompanyForm";
import CompanyJobPage from "../../features/companyJobs/CompanyJobPage";
import CompanyJobForm from "../../features/companyJobs/CompanyJobForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Routes untuk Categories (Halaman utama diarahkan ke Categories)
      { path: "", element: <CategoryPage /> },
      { path: "categories/create", element: <CategoryForm /> },
      { path: "categories/edit/:id", element: <CategoryForm /> },

      // Routes untuk Companies
      { path: "companies", element: <CompanyPage /> },
      { path: "companies/create", element: <CompanyForm /> },
      { path: "companies/edit/:id", element: <CompanyForm /> },

      // Routes untuk Company Jobs
      { path: "company-jobs", element: <CompanyJobPage /> },
      { path: "company-jobs/create", element: <CompanyJobForm /> },
      { path: "company-jobs/edit/:id", element: <CompanyJobForm /> },
    ],
  },
]);
