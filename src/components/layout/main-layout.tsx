import type { ReactNode } from "react";
import { RouteTransition } from "./route-transition";

interface MainLayoutProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  utility?: ReactNode;
  sidebar?: ReactNode;
}

export function MainLayout({ children, header, footer, utility, sidebar }: MainLayoutProps) {
  return (
    <div className="bg-paper text-ink flex min-h-screen flex-col">
      {utility}
      {header}
      <div id="main-content" className="flex flex-1 flex-col">
        <RouteTransition>
          {sidebar ? (
            <div className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <main>{children}</main>
              <aside aria-label="Related information" className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                {sidebar}
              </aside>
            </div>
          ) : (
            children
          )}
        </RouteTransition>
      </div>
      {footer}
    </div>
  );
}
