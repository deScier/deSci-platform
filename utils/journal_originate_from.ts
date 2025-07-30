import { Option } from "@/components/common/Input/Typing";
import { uniqueId } from "lodash";
import { slugfy } from "./slugfy";

export const journal_originate_from: Option[] = [
  { id: uniqueId(), label: "New Area of Knowledge", value: slugfy("New Area of Knowledge") },
  { id: uniqueId(), label: "Community", value: slugfy("Community") },
  { id: uniqueId(), label: "University", value: slugfy("University") },
  { id: uniqueId(), label: "Faculty", value: slugfy("Faculty") },
  { id: uniqueId(), label: "Conference", value: slugfy("Conference") },
  { id: uniqueId(), label: "Event", value: slugfy("Event") },
  { id: uniqueId(), label: "Association", value: slugfy("Association") },
  { id: uniqueId(), label: "Startup", value: slugfy("Startup") },
  { id: uniqueId(), label: "Company", value: slugfy("Company") },
  { id: uniqueId(), label: "Foundation", value: slugfy("Foundation") },
  { id: uniqueId(), label: "Organization", value: slugfy("Organization") },
  { id: uniqueId(), label: "Institution", value: slugfy("Institution") },
  { id: uniqueId(), label: "Other", value: slugfy("Other") },
];
