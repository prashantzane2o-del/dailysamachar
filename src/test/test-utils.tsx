import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

// Dummy messages for next-intl taaki tests mein translation keys resolve ho sakein
const mockMessages = {
  Index: {
    title: "DailySamachar",
    description: "Latest News",
  },
  Common: {
    loading: "Loading...",
    error: "Something went wrong",
    readMore: "Read More",
  },
};

// React Query client specifically for testing (retries disabled for faster failure)
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Tests mein API fail hone par retry nahi karna chahiye
        gcTime: 0,    // Cache turant clear ho jaye
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={testQueryClient}>
        <NextIntlClientProvider locale="en" messages={mockMessages}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

// Custom render function jo default render ko override karega
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Testing library ki baaki sabhi utilities ko re-export kar rahe hain
export * from "@testing-library/react";

// Default render ko apne customRender se replace kar diya
export { customRender as render };