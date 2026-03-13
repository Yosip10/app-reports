export interface Report {
  id: string;
  name: string;
  type: "Sales" | "Inventory" | "Users" | "Other";
  status: "Pending" | "Completed" | "Failed";
  createdBy: string;
  createdAt: string;
  description?: string;
}

export interface ReportFilter {
  search?: string;
  type?: string;
  status?: string;
}
