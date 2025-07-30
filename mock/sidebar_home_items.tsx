import { home_routes } from "@/routes/home";
import { uniqueId } from "lodash";
import RedirectIcon from "public/svgs/common/redirect.svg";

export const dashboard_key = uniqueId("dashboard_");

export const links = [
  {
    id: uniqueId(),
    label: "Home",
    link: home_routes.home.index,
    icon: null,
  },
  {
    id: uniqueId(),
    label: "Search",
    link: home_routes.home.search,
    icon: null,
  },
  {
    id: dashboard_key,
    label: "Dashboard",
    link: home_routes.summary,
    icon: null,
  },
  {
    id: uniqueId(),
    label: "Maxi Science",
    link: "https://maxi.science",
    icon: (
      <RedirectIcon className="w-4 h-4 fill-blue-gray mb-1 hover:text-secundary_blue-main transition-all duration-200" />
    ),
  },
  {
    id: uniqueId(),
    label: "About us",
    link: "https://descier.science",
    icon: (
      <RedirectIcon className="w-4 h-4 fill-blue-gray mb-1 hover:text-secundary_blue-main transition-all duration-200" />
    ),
  },
  {
    id: uniqueId(),
    label: "My IP",
    link: "https://registermaxi.io",
    icon: (
      <RedirectIcon className="w-4 hs-4 fill-blue-gray mb-1 hover:text-secundary_blue-main transition-all duration-200" />
    ),
  },
];
