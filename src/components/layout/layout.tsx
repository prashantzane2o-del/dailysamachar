import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

// 1. Section Wrapper
export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("py-8 md:py-12", className)}>{children}</section>;
}

// 2. Container Wrapper
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

// 3. Sidebar Layout (Fixes the 'SidebarLayout is not exported' error)
export function SidebarLayout({
  children,
  sidebar,
  className,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 items-start gap-8 lg:grid-cols-12", className)}>
      <div className="lg:col-span-8">{children}</div>
      <aside className="space-y-8 lg:col-span-4">{sidebar}</aside>
    </div>
  );
}

// 4. Content Grid (Fixes the 'ContentGrid is not exported' error)
export function ContentGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>;
}
