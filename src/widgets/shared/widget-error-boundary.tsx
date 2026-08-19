"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class WidgetErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Widget rendering failed", { error, info });
  }

  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}
