import { Option } from "@/components/common/Input/Typing";
import { uniqueId } from "lodash";

export const articles_categories: Option[] = [
  {
    id: uniqueId(),
    label: "Research articles",
    value: "research-articles",
  },
  {
    id: uniqueId(),
    label: "Cases and notes",
    value: "cases-and-notes",
  },
  {
    id: uniqueId(),
    label: "Reviews",
    value: "reviews",
  },
  {
    id: uniqueId(),
    label: "Communications",
    value: "communications",
  },
  {
    id: uniqueId(),
    label: "Others",
    value: "others",
  },
];

export const article_category_filter: Option[] = [
  {
    id: uniqueId(),
    label: "All",
    value: null,
  },
  {
    id: uniqueId(),
    label: "Research articles",
    value: "research-articles",
  },
  {
    id: uniqueId(),
    label: "Cases and notes",
    value: "cases-and-notes",
  },
  {
    id: uniqueId(),
    label: "Reviews",
    value: "reviews",
  },
  {
    id: uniqueId(),
    label: "Communications",
    value: "communications",
  },
  {
    id: uniqueId(),
    label: "Others",
    value: "others",
  },
];
