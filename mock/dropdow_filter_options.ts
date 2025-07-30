import { uniqueId } from "lodash";

export interface FilterOption {
  id: number | string;
  label: string;
  value: string | number | null;
}

export const filter_order_by = [
  {
    id: uniqueId(),
    label: "Newest",
    value: "newest",
  },
  {
    id: uniqueId(),
    label: "Oldest",
    value: "oldest",
  },
  {
    id: uniqueId(),
    label: "Most viewed",
    value: "most_viewed",
  },
  {
    id: uniqueId(),
    label: "Most liked",
    value: "most_liked",
  },
];

export const filter_access = [
  {
    id: uniqueId(),
    label: "Open",
    value: "open",
  },
  {
    id: uniqueId(),
    label: "Paid",
    value: "paid",
  },
];

export const filter_document_type = [
  {
    id: uniqueId(),
    label: "Manuscript",
    value: "manuscript",
  },
  {
    id: uniqueId(),
    label: "Paper",
    value: "paper",
  },
  {
    id: uniqueId(),
    label: "Report",
    value: "report",
  },
  {
    id: uniqueId(),
    label: "Review",
    value: "review",
  },
  {
    id: uniqueId(),
    label: "Conference abstract",
    value: "conference abstract",
  },
];

export const filter_field = [
  {
    id: uniqueId(),
    label: "Biology",
    value: "biology",
  },
  {
    id: uniqueId(),
    label: "Technology",
    value: "technology",
  },
  {
    id: uniqueId(),
    label: "Mathematics",
    value: "mathematics",
  },
  {
    id: uniqueId(),
    label: "Physics",
    value: "physics",
  },
  {
    id: uniqueId(),
    label: "Chemistry",
    value: "chemistry",
  },
];

export const filter_by_year = [
  {
    id: uniqueId(),
    label: "2023",
    value: 2023,
  },
  {
    id: uniqueId(),
    label: "2024",
    value: 2024,
  },
];

export const filter_status = [
  {
    id: uniqueId(),
    label: "Pending",
    value: "pending",
  },
  {
    id: uniqueId(),
    label: "Approved",
    value: "approved",
  },
  {
    id: uniqueId(),
    label: "Final approval pending",
    value: "admin_approve",
  },
  {
    id: uniqueId(),
    label: "Rejected",
    value: "rejected",
  },
  {
    id: uniqueId(),
    label: "Published",
    value: "submitted",
  },
];

export const journal_status_option = [
  {
    id: uniqueId(),
    label: "All",
    value: "ALL",
  },
  {
    id: uniqueId(),
    label: "Pending",
    value: "PENDING",
  },
  {
    id: uniqueId(),
    label: "Approved",
    value: "APPROVED",
  },
  {
    id: uniqueId(),
    label: "Rejected",
    value: "REJECTED",
  },
];

export const reviewer_filter_status = [
  {
    id: uniqueId(),
    label: "All status",
    value: "all",
  },
  {
    id: uniqueId(),
    label: "Pending",
    value: "pending",
  },
  {
    id: uniqueId(),
    label: "You approved",
    value: "approved",
  },
];
