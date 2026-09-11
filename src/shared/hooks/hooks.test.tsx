import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useClickOutside } from "./use-click-outside";
import { useIntersectionObserver } from "./use-intersection-observer";
import { useLocalStorage } from "./use-local-storage";
import { useScrollDirection } from "./use-scroll-direction";

function ClickOutsideProbe({ onOutside }: { onOutside: () => void }) {
  const ref = useClickOutsideRef(onOutside);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <button type="button" data-testid="outside">
        Outside
      </button>
    </div>
  );
}

function useClickOutsideRef(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside);
  return ref;
}

describe("useClickOutside", () => {
  it("only calls the handler for interactions outside the referenced element", () => {
    const onOutside = vi.fn();
    render(<ClickOutsideProbe onOutside={onOutside} />);

    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(onOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOutside).toHaveBeenCalledOnce();
  });
});

describe("useLocalStorage", () => {
  afterEach(() => localStorage.clear());

  it("hydrates from storage and persists state updates", () => {
    localStorage.setItem("reading-mode", JSON.stringify("compact"));
    const { result } = renderHook(() => useLocalStorage("reading-mode", "comfortable"));

    expect(result.current[0]).toBe("compact");

    act(() => result.current[1]((value) => `${value}-updated`));

    expect(result.current[0]).toBe("compact-updated");
    expect(localStorage.getItem("reading-mode")).toBe(JSON.stringify("compact-updated"));
  });

  it("accepts storage events from another tab", () => {
    const { result } = renderHook(() => useLocalStorage("font-size", "medium"));

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "font-size",
          newValue: JSON.stringify("large"),
        }),
      );
    });

    expect(result.current[0]).toBe("large");
  });
});

describe("useScrollDirection", () => {
  it("reports meaningful up and down movements", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true });
    const { result } = renderHook(() => useScrollDirection(10));

    act(() => {
      window.scrollY = 40;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("down");

    act(() => {
      window.scrollY = 15;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("up");
  });
});

describe("useIntersectionObserver", () => {
  it("updates visibility and disconnects when frozen after the first match", () => {
    class MockIntersectionObserver {
      static current: MockIntersectionObserver | undefined;
      readonly observe = vi.fn();
      readonly disconnect = vi.fn();
      readonly unobserve = vi.fn();
      readonly takeRecords = vi.fn(() => []);
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0];

      constructor(private readonly callback: IntersectionObserverCallback) {
        MockIntersectionObserver.current = this;
      }

      trigger(isIntersecting: boolean) {
        this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    function Probe() {
      const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ freezeOnceVisible: true });
      return (
        <div ref={ref} data-testid="visibility">
          {String(isIntersecting)}
        </div>
      );
    }

    render(<Probe />);
    expect(MockIntersectionObserver.current?.observe).toHaveBeenCalledWith(screen.getByTestId("visibility"));

    act(() => MockIntersectionObserver.current?.trigger(true));
    expect(screen.getByTestId("visibility")).toHaveTextContent("true");
    expect(MockIntersectionObserver.current?.disconnect).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
