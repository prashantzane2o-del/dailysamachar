import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// 1. Mocking Next.js 15 App Router Hooks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => "/en"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({ locale: "en" })),
}));

// 2. Mocking next/headers for Server Components
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
  })),
  headers: vi.fn(() => new Headers()),
}));

// 3. Mocking next-intl (Translations)
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
  useNow: () => new Date("2026-09-07T10:09:10Z"),
  useTimeZone: () => "Asia/Kolkata",
}));

// 4. Mocking Framer Motion (Disable animations for faster tests & avoiding act() warnings)
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      ...actual.motion,
      div: React.forwardRef((props: any, ref: any) => {
        const {
          initial,
          animate,
          exit,
          transition,
          variants,
          whileHover,
          whileTap,
          whileInView,
          viewport,
          ...rest
        } = props;
        return React.createElement("div", { ref, ...rest });
      }),
      span: React.forwardRef((props: any, ref: any) => {
        const {
          initial,
          animate,
          exit,
          transition,
          variants,
          whileHover,
          whileTap,
          whileInView,
          viewport,
          ...rest
        } = props;
        return React.createElement("span", { ref, ...rest });
      }),
    },
  };
});

// 5. Mocking IntersectionObserver (Required for infinite scrolling & lazy loading widgets)
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// 6. Mocking ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.ResizeObserver = mockResizeObserver;

// 7. Mocking window.matchMedia (Required for Theme toggles)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});