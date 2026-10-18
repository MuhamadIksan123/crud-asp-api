import { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useDeleteCompanyMutation, useGetCompaniesQuery } from "./companyApi";
import { toast } from "react-toastify";

export default function CompanyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetCompaniesQuery(
    { pageNumber: currentPage, searchTerm },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteCompany] = useDeleteCompanyMutation();

  const companies = data?.items || [];
  const pagination = data?.pagination;

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCompany(id).unwrap();
      toast.success("Company deleted successfully.");
    } catch (error) {
      console.log("Company delete failed:", error);
      toast.error("Failed to delete company.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-1 fw-bold" style={{ color: "#1e1b4b" }}>
          Manage Companies
        </h1>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="mb-3" style={{ maxWidth: 300 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Link
          to="/companies/create"
          className="btn btn-primary px-4 fw-bold text-decoration-none"
        >
          Add New
        </Link>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : companies.length === 0 ? (
        <p>Data belum tersedia</p>
      ) : (
        <>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Logo</th>
                <th className="text-nowrap">Name</th>
                <th>About</th>
                <th className="text-nowrap">Date</th>
                <th className="text-center" style={{ width: "180px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="text-center">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span className="text-muted small">No Logo</span>
                    )}
                  </td>
                  <td className="text-nowrap">{company.name}</td>
                  <td>{company.about}</td>
                  <td className="text-nowrap">
                    {new Date(company.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-center">
                    <Link
                      to={`/companies/edit/${company.id}`}
                      className="btn btn-sm btn-primary me-2 px-3"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger px-3"
                      onClick={() => void handleDelete(company.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${currentPage === pagination.totalPages ? "disabled" : ""}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
