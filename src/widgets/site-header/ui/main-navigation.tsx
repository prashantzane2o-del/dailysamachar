import { cmsClient } from "@/shared/api/cms";
import type { Category } from "@/types/news";
import { Link } from "@/i18n/navigation";

export async function MainNavigation() {
  let categories: Category[] = [];
  try {
    categories = await cmsClient.getCategories();
  } catch (error) {
    console.error("Failed to fetch categories for main navigation:", error);
  }

  const sortedCategories = [...categories].sort((a: Category, b: Category) => {
    return a.title.localeCompare(b.title);
  });

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link href="/" className="font-medium text-ink transition-colors hover:text-signal dark:text-gray-100">
        Home
      </Link>

      {sortedCategories.map((category: Category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className="font-medium capitalize text-ink transition-colors hover:text-signal dark:text-gray-100"
        >
          {category.title}
        </Link>
      ))}
    </nav>
  );
}

// Depending on how this was imported in site-header.tsx, you may need a default export
export default MainNavigation;
