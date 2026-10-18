import { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "./categoryApi";
import { toast } from "react-toastify";

export default function CategoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetCategoriesQuery(
    { pageNumber: currentPage, searchTerm },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.items || [];
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
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.log("Category delete failed:", error);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-1 fw-bold" style={{ color: "#1e1b4b" }}>
          Manage Categories
        </h1>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="mb-3" style={{ maxWidth: 300 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Link
          to="/categories/create"
          className="btn btn-primary px-4 fw-bold text-decoration-none"
        >
          Add New
        </Link>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>Data belum tersedia</p>
      ) : (
        <>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th className="text-center" style={{ width: "180px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-center">
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="btn btn-sm btn-primary me-2 px-3"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger px-3"
                      onClick={() => void handleDelete(category.id)}
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
