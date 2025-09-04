import { SignInForm } from "@/components/auth/sign-in-form"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-balance text-2xl font-semibold mb-4">Sign in</h1>
      <SignInForm />
      <p className="mt-3 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a className="text-primary underline" href="/auth/sign-up">
          Create one
        </a>
      </p>
    </main>
  )
}
