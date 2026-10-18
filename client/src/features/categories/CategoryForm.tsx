import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";
import {
  categorySchema,
  type CategoryFormValues,
} from "../../schemas/validationSchemas";

export default function CategoryForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Ambil data spesifik berdasarkan ID langsung dari API
  const { data: currentCategory } = useGetCategoryByIdQuery(Number(id), {
    skip: !isEditMode,
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (currentCategory) {
      reset({ name: currentCategory.name });
    }
  }, [currentCategory, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("Name", values.name);

    try {
      if (isEditMode) {
        await updateCategory({ id: Number(id), body: formData }).unwrap();
        toast.success("Category updated successfully.");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully.");
      }
      navigate("/");
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <div className="m-4" style={{ maxWidth: "500px" }}>
      <h3 className="fw-bold mb-3" style={{ color: "#1e1b4b" }}>
        {isEditMode ? "Edit Category" : "Add New Category"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label text-muted small fw-semibold">
            Category Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="e.g. Fullstack, DevOps..."
            {...register("name")}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary px-3"
            onClick={() => navigate("/")}
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
