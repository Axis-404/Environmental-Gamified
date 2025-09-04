import AppShell from "@/components/app-shell"
import { notFound } from "next/navigation"
import { lessons } from "@/lib/lessons"
import { QuizRunner } from "@/components/quiz/quiz-runner"

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = lessons.find((l) => l.slug === params.slug)
  if (!lesson) return notFound()

  return (
    <AppShell title={lesson.title}>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {lesson.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <div className="my-6 h-px w-full bg-border" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quiz</h2>
        <QuizRunner lessonSlug={lesson.slug} questions={lesson.quiz} />
      </section>
    </AppShell>
  )
}
