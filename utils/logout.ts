import { COOKIE_KEYS } from "@/utils/cookies_keys";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";

export const handleLogout = async (redirect: () => void) => {
  redirect();
  await signOut({ redirect: false });
  localStorage.clear();
  sessionStorage.clear();
  deleteCookie(COOKIE_KEYS.WALLET);
};
