import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  companyJobSchema,
  type CompanyJobFormValues,
} from "../../schemas/validationSchemas";
import {
  useCreateCompanyJobMutation,
  useUpdateCompanyJobMutation,
  useGetCompanyJobByIdQuery,
} from "./companyJobApi";
import { useGetCompaniesQuery } from "../companies/companyApi";
import { useGetCategoriesQuery } from "../categories/categoryApi";

export default function CompanyJobForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: companiesData } = useGetCompaniesQuery({
    pageNumber: 1,
    pageSize: 50,
  });
  const { data: categoriesData } = useGetCategoriesQuery({
    pageNumber: 1,
    pageSize: 50,
  });

  // Mengambil data spesifik berdasarkan ID langsung dari backend (bebas masalah paginasi)
  const { data: currentJob } = useGetCompanyJobByIdQuery(Number(id), {
    skip: !isEditMode,
  });

  const [createJob, { isLoading: isCreating }] = useCreateCompanyJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateCompanyJobMutation();

  // Helper untuk mengubah array dari backend (objek/string) menjadi string berformat baris baru (\n)
  const formatListToString = (list: unknown): string => {
    if (!Array.isArray(list)) return "";
    return list
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.name || item?.description || item?.text || "";
      })
      .filter(Boolean)
      .join("\n");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyJobFormValues>({
    resolver: zodResolver(companyJobSchema) as Resolver<CompanyJobFormValues>,
    values: {
      name: currentJob?.name || "",
      type: currentJob?.type || "Full-time",
      location: currentJob?.location || "",
      skillLevel: currentJob?.skillLevel || "Mid-Level",
      salary: Number(currentJob?.salary || 0),
      about: currentJob?.about || "",
      isOpen: currentJob?.isOpen ?? true,
      companyId: Number(currentJob?.companyId || 0),
      categoryId: Number(currentJob?.categoryId || 0),
      responsibilities: formatListToString(currentJob?.responsibilities),
      qualifications: formatListToString(currentJob?.qualifications),
    },
  });

  const onSubmit = async (values: CompanyJobFormValues) => {
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Type", values.type);
    formData.append("Location", values.location);
    formData.append("SkillLevel", values.skillLevel);
    formData.append("Salary", values.salary.toString());
    formData.append("About", values.about);
    formData.append("IsOpen", values.isOpen.toString());
    formData.append("CompanyId", values.companyId.toString());
    formData.append("CategoryId", values.categoryId.toString());

    // Memecah teks textarea per baris menjadi array point terpisah untuk backend
    values.responsibilities
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item, index) => {
        formData.append(`Responsibilities[${index}]`, item);
      });

    values.qualifications
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item, index) => {
        formData.append(`Qualifications[${index}]`, item);
      });

    try {
      if (isEditMode) {
        await updateJob({ id: Number(id), body: formData }).unwrap();
        toast.success("Job updated successfully.");
      } else {
        await createJob(formData).unwrap();
        toast.success("Job created successfully.");
      }
      navigate("/company-jobs");
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  return (
    <div className="container my-3" style={{ maxWidth: "900px" }}>
      <h3 className="fw-bold mb-3" style={{ color: "#1e1b4b" }}>
        {isEditMode ? "Edit Job Vacancy" : "Add New Job Vacancy"}
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card border-0 p-3 shadow-sm"
      >
        {/* Baris 1: Job Title & Location (Ukuran 6 & 6) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Job Title
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Location
            </label>
            <input
              type="text"
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              {...register("location")}
            />
            {errors.location && (
              <div className="invalid-feedback">{errors.location.message}</div>
            )}
          </div>
        </div>

        {/* Baris 2: Company & Category (Ukuran 6 & 6) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Company
            </label>
            <select
              className={`form-select ${errors.companyId ? "is-invalid" : ""}`}
              {...register("companyId")}
            >
              <option value="0">Select Company</option>
              {companiesData?.items?.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <div className="invalid-feedback">{errors.companyId.message}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Category
            </label>
            <select
              className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
              {...register("categoryId")}
            >
              <option value="0">Select Category</option>
              {categoriesData?.items?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div className="invalid-feedback">
                {errors.categoryId.message}
              </div>
            )}
          </div>
        </div>

        {/* Baris 3: Employment Type & Skill Level (Ukuran 6 & 6) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Employment Type
            </label>
            <select className="form-select" {...register("type")}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Skill Level
            </label>
            <select className="form-select" {...register("skillLevel")}>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>

        {/* Baris 4: Salary & Status (Ukuran 6 & 6) */}
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Salary (IDR)
            </label>
            <input
              type="number"
              className={`form-control ${errors.salary ? "is-invalid" : ""}`}
              {...register("salary")}
            />
            {errors.salary && (
              <div className="invalid-feedback">{errors.salary.message}</div>
            )}
          </div>

          <div className="col-md-6 mb-3 d-flex align-items-center pt-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isOpenCheck"
                {...register("isOpen")}
              />
              <label
                className="form-check-label small fw-semibold"
                htmlFor="isOpenCheck"
              >
                Job is Open (Active)
              </label>
            </div>
          </div>
        </div>

        {/* Baris 5: Job Description / About */}
        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">
            Job Description / About
          </label>
          <textarea
            className={`form-control ${errors.about ? "is-invalid" : ""}`}
            rows={3}
            {...register("about")}
          />
          {errors.about && (
            <div className="invalid-feedback">{errors.about.message}</div>
          )}
        </div>

        {/* Baris 6: Responsibilities & Qualifications (Ukuran 6 & 6) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Responsibilities{" "}
              <span className="text-muted fw-normal">(1 line = 1 point)</span>
            </label>
            <textarea
              className={`form-control ${errors.responsibilities ? "is-invalid" : ""}`}
              rows={4}
              placeholder={"- First responsibility\n- Second responsibility"}
              {...register("responsibilities")}
            />
            {errors.responsibilities && (
              <div className="invalid-feedback">
                {errors.responsibilities.message}
              </div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-semibold">
              Qualifications{" "}
              <span className="text-muted fw-normal">(1 line = 1 point)</span>
            </label>
            <textarea
              className={`form-control ${errors.qualifications ? "is-invalid" : ""}`}
              rows={4}
              placeholder={"- First qualification\n- Second qualification"}
              {...register("qualifications")}
            />
            {errors.qualifications && (
              <div className="invalid-feedback">
                {errors.qualifications.message}
              </div>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="d-flex align-items-center gap-2 mt-3">
          <button
            type="button"
            className="btn btn-secondary px-3"
            onClick={() => navigate("/company-jobs")}
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
