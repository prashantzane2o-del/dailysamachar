"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui/primitives";
import { loginSchema, resetSchema, signupSchema, type LoginInput, type ResetInput, type SignupInput } from "../model/schemas";
type Mode = "login" | "signup" | "reset";
export function AuthForm({ mode }: { mode: Mode }) { const schema = mode === "login" ? loginSchema : mode === "signup" ? signupSchema : resetSchema; const form = useForm<LoginInput | SignupInput | ResetInput>({ resolver: zodResolver(schema), defaultValues: { email: "" } }); const submit = async () => { await new Promise(resolve => setTimeout(resolve, 300)); }; return <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-4" noValidate>{mode === "signup" && <Input aria-label="Your name" placeholder="Your name" {...form.register("name" as never)}/>}<Input aria-label="Email address" type="email" placeholder="Email address" {...form.register("email")}/>{mode !== "reset" && <Input aria-label="Password" type="password" placeholder="Password" {...form.register("password" as never)}/>}<Button type="submit" className="w-full">{mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</Button></form>; }
