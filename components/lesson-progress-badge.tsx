"use client"

import { Progress } from "@/components/ui/progress"
import { useLessonProgress } from "@/hooks/use-lesson-progress"

export function LessonProgressBadge({ slug }: { slug: string }) {
  const { progress } = useLessonProgress(slug)
  const value = progress ?? 0

  return (
    <div className="flex items-center gap-2">
      <div className="w-24">
        <Progress value={value} className="h-2" />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  )
}
