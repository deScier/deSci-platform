import { uniqueId } from "lodash";

export type Author = {
  id: string;
  name: string;
  title: string;
  email: string;
  share?: string | null;
  wallet?: string | null;
  role?: string;
  status?: string;
};

export type Authorship = {
  name: string;
  share: string;
  wallet: string;
  email: string;
};

export const authors_mock: Author[] = [
  {
    id: uniqueId(),
    name: "Caroline Nunes",
    title: "Neurologist",
    email: "caroline@gmail.com",
    share: null,
    wallet: null,
    role: "reviewer",
    status: "pending",
  },
];

export const authors_headers = [
  {
    id: 1,
    label: "Name",
  },
  {
    id: 1,
    label: "Expertise",
  },
  {
    id: 1,
    label: "E-mail",
  },
];

export const authorship_headers = [
  {
    id: 1,
    label: "Name",
    tooltip: null,
  },
  {
    id: 1,
    label: "Authorship Share",
    tooltip: "The total added up authorship value must be 100%",
  },
  {
    id: 1,
    label: "Wallet",
    tooltip: "Add digital wallet such as MetaMask, if available. You can add this later.",
  },
];
