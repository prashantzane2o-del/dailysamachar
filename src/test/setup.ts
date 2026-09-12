// src/test/setup.ts
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
  useNow: () => new Date("2026-09-12T23:24:45Z"),
  useTimeZone: () => "Asia/Kolkata",
}));

// Utility to clean Framer Motion props
const filterMotionProps = (props: Record<string, unknown>) => {
  const cleanProps = { ...props };
  const motionKeys = [
    "initial", "animate", "exit", "transition", "variants", 
    "whileHover", "whileTap", "whileInView", "viewport", "layout"
  ];
  motionKeys.forEach((key) => delete cleanProps[key]);
  return cleanProps;
};

// Forward Refs with Display Names
const MockMotionDiv = React.forwardRef<HTMLDivElement, Record<string, unknown>>((props, ref) => {
  return React.createElement("div", { ref, ...filterMotionProps(props) });
});
MockMotionDiv.displayName = "MockMotionDiv";

const MockMotionSpan = React.forwardRef<HTMLSpanElement, Record<string, unknown>>((props, ref) => {
  return React.createElement("span", { ref, ...filterMotionProps(props) });
});
MockMotionSpan.displayName = "MockMotionSpan";

// 4. Mocking Framer Motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      ...actual.motion,
      div: MockMotionDiv,
      span: MockMotionSpan,
    },
  };
});

// 5. Mocking IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

// 6. Mocking ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver;

// 7. Mocking window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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