// src/features/auth/ui/auth-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/shared/ui/primitives";
import {
  loginSchema,
  resetSchema,
  signupSchema,
  type LoginInput,
  type ResetInput,
  type SignupInput,
} from "../model/schemas";

type Mode = "login" | "signup" | "reset";
type FormValues = LoginInput | SignupInput | ResetInput;
type FieldError = { message?: string } | undefined;

export function AuthForm({ mode }: { mode: Mode }) {
  const schema = mode === "login" ? loginSchema : mode === "signup" ? signupSchema : resetSchema;
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errors = form.formState.errors as Partial<Record<"email" | "password" | "name" | "consent", FieldError>>;

  const submit = async (data: FormValues) => {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error || "Something went wrong. Please try again.");
      } else {
        setStatus(result.message || "Success!");
        // Form reset for signup and password reset after success
        if (mode !== "login") {
          form.reset();
        }
      }
    } catch (error) {
      console.error("Auth request failed:", error);
      setStatus("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-4" noValidate aria-describedby="auth-status">
      {mode === "signup" && (
        <div>
          <label htmlFor="auth-name" className="sr-only">
            Your name
          </label>
          <Input
            id="auth-name"
            aria-label="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "auth-name-error" : undefined}
            placeholder="Your name"
            {...form.register("name" as never)}
          />
          {errors.name?.message && (
            <p id="auth-name-error" role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="auth-email" className="sr-only">
          Email address
        </label>
        <Input
          id="auth-email"
          aria-label="Email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "auth-email-error" : undefined}
          type="email"
          placeholder="Email address"
          {...form.register("email")}
        />
        {errors.email?.message && (
          <p id="auth-email-error" role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {mode !== "reset" && (
        <div>
          <label htmlFor="auth-password" className="sr-only">
            Password
          </label>
          <Input
            id="auth-password"
            aria-label="Password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "auth-password-error" : undefined}
            type="password"
            placeholder="Password"
            {...form.register("password" as never)}
          />
          {errors.password?.message && (
            <p
              id="auth-password-error"
              role="alert"
              className="mt-1 text-sm font-medium text-red-600 dark:text-red-400"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      {mode === "signup" && (
        <div>
          <label className="text-muted flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-brand-accent focus-visible:ring-brand-accent mt-1 focus-visible:ring-2 focus-visible:outline-none"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "auth-consent-error" : undefined}
              {...form.register("consent" as never)}
            />
            <span>I agree to the Daily Samachar terms and privacy policy.</span>
          </label>
          {errors.consent?.message && (
            <p id="auth-consent-error" role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
              {errors.consent.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
      </Button>

      {/* FIXED: Made status text visible so user can actually read the API response */}
      {status && (
        <p id="auth-status" className="mt-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </form>
  );
}