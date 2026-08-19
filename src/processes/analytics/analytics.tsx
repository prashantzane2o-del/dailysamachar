"use client";
import { useEffect } from "react";
const integrations = { ga: process.env.NEXT_PUBLIC_GA_ID, gtm: process.env.NEXT_PUBLIC_GTM_ID, clarity: process.env.NEXT_PUBLIC_CLARITY_ID };
export function Analytics() { useEffect(() => { if (integrations.ga) window.dispatchEvent(new CustomEvent("analytics-ready", { detail: integrations })); }, []); return null; }
