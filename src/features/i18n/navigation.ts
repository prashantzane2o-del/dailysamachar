import { createNavigation } from "next-intl/navigation";
// FIXED: Use the absolute path alias instead of relative path
import { routing } from "@/i18n/routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);