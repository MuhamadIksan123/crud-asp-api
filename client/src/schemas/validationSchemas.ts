import { z } from "zod";

// category
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
// end category

// company
export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  about: z.string().min(1, "About is required"),
  logoUrl: z.string().optional(),
});
export type CompanyFormValues = z.infer<typeof companySchema>;
// end company

// company job
export const companyJobSchema = z.object({
  name: z.string().min(1, "Job title is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  salary: z.coerce.number().min(1, "Salary must be greater than 0"),
  about: z.string().min(1, "About/Description is required"),
  isOpen: z.boolean(),
  companyId: z.coerce.number().min(1, "Company is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  responsibilities: z
    .string()
    .min(1, "At least one responsibility is required"),
  qualifications: z.string().min(1, "At least one qualification is required"),
});
export type CompanyJobFormValues = z.infer<typeof companyJobSchema>;
// end company job
