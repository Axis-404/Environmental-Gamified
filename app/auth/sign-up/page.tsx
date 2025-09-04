import { SignUpForm } from "@/components/auth/sign-up-form"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-balance text-2xl font-semibold mb-4">Create account</h1>
      <SignUpForm />
      <p className="mt-3 text-sm text-muted-foreground">
        Already have an account?{" "}
        <a className="text-primary underline" href="/auth/sign-in">
          Sign in
        </a>
      </p>
    </main>
  )
}
