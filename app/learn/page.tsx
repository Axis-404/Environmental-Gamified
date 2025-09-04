import AppShell from "@/components/app-shell"
import { lessons } from "@/lib/lessons"
import { LessonCard } from "@/components/lesson-card"

export default function Page() {
  return (
    <AppShell title="Learn">
      <ul className="grid grid-cols-1 gap-3">
        {lessons.map((l) => (
          <li key={l.slug}>
            <LessonCard lesson={l} />
          </li>
        ))}
      </ul>
    </AppShell>
  )
}
