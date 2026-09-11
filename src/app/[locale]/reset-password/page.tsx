import { AuthForm } from "@/features/auth/ui/auth-form";
export default function ResetPassword() {
  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <section className="bg-paper w-full max-w-md rounded-2xl border p-7 shadow-sm">
        <p className="kicker">Secure reset</p>
        <h1 className="editorial mt-2 text-4xl font-bold">Choose a new password.</h1>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
