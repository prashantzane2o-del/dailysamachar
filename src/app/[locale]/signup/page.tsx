import Link from "next/link";
import { AuthForm } from "@/features/auth/ui/auth-form";
export default function Signup() {
  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <section className="bg-paper w-full max-w-md rounded-2xl border p-7 shadow-sm">
        <p className="kicker">A more personal news habit</p>
        <h1 className="editorial mt-2 text-4xl font-bold">Create your account.</h1>
        <AuthForm mode="signup" />
        <p className="text-muted mt-5 text-center text-sm">
          Already a member?{" "}
          <Link href="/login" className="hover:text-signal">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
