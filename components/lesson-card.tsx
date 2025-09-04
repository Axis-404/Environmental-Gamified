import Link from "next/link"
import type { Lesson } from "@/lib/lessons"
import { LessonProgressBadge } from "./lesson-progress-badge"

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="block rounded-lg border bg-card p-4 hover:bg-muted transition-colors"
      aria-label={`Open lesson: ${lesson.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-foreground">{lesson.title}</h3>
          <p className="text-sm text-muted-foreground">
            {lesson.duration} • {lesson.summary}
          </p>
        </div>
        <LessonProgressBadge slug={lesson.slug} />
      </div>
    </Link>
  )
}
