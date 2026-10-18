export interface CompanyJob {
  id: number;
  name: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: number;
  isOpen: boolean;
  companyId: number;
  categoryId: number;
  about: string;
  skillLevel: string;
  createdAt: string | null;
  categoryName: string;
  responsibilities: string[];
  qualifications: string[];
  relatedJobs: CompanyJob[];
}
