import { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import {
  useDeleteCompanyJobMutation,
  useGetCompanyJobsQuery,
} from "./companyJobApi";

export default function CompanyJobPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetCompanyJobsQuery(
    { pageNumber: currentPage, searchTerm },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteCompanyJob] = useDeleteCompanyJobMutation();

  const jobs = data?.items || [];
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
      await deleteCompanyJob(id).unwrap();
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.log("Job delete failed:", error);
      toast.error("Failed to delete job.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-1 fw-bold" style={{ color: "#1e1b4b" }}>
          Manage Company Jobs
        </h1>
        <Link
          to="/company-jobs/create"
          className="btn rounded-pill px-4 py-2 fw-bold text-white text-decoration-none shadow-sm"
          style={{ backgroundColor: "#43338CA" }}
        >
          Add New
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-3" style={{ maxWidth: 300 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>Data belum tersedia</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Logo</th>
                  <th className="text-nowrap">Nama Pekerjaan</th>
                  <th className="text-nowrap">Nama Perusahaan</th>
                  <th className="text-nowrap">Category</th>
                  <th className="text-nowrap">Skill Level</th>
                  <th className="text-nowrap">Type</th>
                  <th className="text-center text-nowrap">Status</th>
                  <th className="text-center" style={{ width: "180px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="text-center">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName || "Company Logo"}
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <span className="text-muted small">No Logo</span>
                      )}
                    </td>
                    <td className="text-nowrap fw-semibold">{job.name}</td>
                    <td className="text-nowrap">{job.companyName}</td>
                    <td className="text-nowrap">{job.categoryName}</td>
                    <td className="text-nowrap">{job.skillLevel}</td>
                    <td className="text-nowrap">{job.type}</td>
                    <td className="text-center">
                      <span
                        className={`badge px-3 py-2 ${
                          job.isOpen ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {job.isOpen ? "Open" : "Close"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/company-jobs/edit/${job.id}`}
                        className="btn btn-sm btn-primary me-2 px-3"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger px-3"
                        onClick={() => void handleDelete(job.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                  className={`page-item ${
                    currentPage === pagination.totalPages ? "disabled" : ""
                  }`}
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
