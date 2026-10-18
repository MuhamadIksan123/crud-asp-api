import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  companySchema,
  type CompanyFormValues,
} from "../../schemas/validationSchemas";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompanyByIdQuery,
} from "./companyApi";

export default function CompanyForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null); // State untuk error logo

  const { data: currentCompany } = useGetCompanyByIdQuery(Number(id), {
    skip: !isEditMode,
  });

  const existingLogoUrl = currentCompany?.logoUrl || "";

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    values: {
      name: currentCompany?.name || "",
      about: currentCompany?.about || "",
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    if (!isEditMode && !logoFile) {
      setLogoError("Company logo is required");
      return;
    }
    setLogoError(null);

    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("About", values.about);
    if (logoFile) {
      formData.append("Logo", logoFile);
    }

    try {
      if (isEditMode) {
        await updateCompany({ id: Number(id), body: formData }).unwrap();
        toast.success("Company updated successfully.");
      } else {
        await createCompany(formData).unwrap();
        toast.success("Company created successfully.");
      }
      navigate("/companies");
    } catch (error) {
      console.error("Failed to save company:", error);
    }
  };

  return (
    <div className="m-4" style={{ maxWidth: "600px" }}>
      <h3 className="fw-bold mb-3" style={{ color: "#1e1b4b" }}>
        {isEditMode ? "Edit Company" : "Add New Company"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">
            Company Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="e.g. TechCorp..."
            {...register("name")}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">
            About
          </label>
          <textarea
            className={`form-control ${errors.about ? "is-invalid" : ""}`}
            rows={4}
            placeholder="Company description..."
            {...register("about")}
          />
          {errors.about && (
            <div className="invalid-feedback">{errors.about.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">
            Company Logo
          </label>
          {existingLogoUrl && !logoFile && (
            <div className="mb-2">
              <img
                src={existingLogoUrl}
                alt="Current Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
          <input
            type="file"
            className={`form-control ${logoError ? "is-invalid" : ""}`}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setLogoFile(e.target.files[0]);
                setLogoError(null); // Hapus error saat file dipilih
              }
            }}
          />
          {logoError && <div className="invalid-feedback">{logoError}</div>}
        </div>

        <div className="d-flex align-items-center gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary px-3"
            onClick={() => navigate("/companies")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
