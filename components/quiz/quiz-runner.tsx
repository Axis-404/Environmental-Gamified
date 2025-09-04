"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLessonProgress } from "@/hooks/use-lesson-progress"
import type { QuizQuestion } from "@/lib/lessons"

export function QuizRunner({
  lessonSlug,
  questions,
}: {
  lessonSlug: string
  questions: QuizQuestion[]
}) {
  const { setProgress } = useLessonProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const current = questions[index]
  const total = questions.length
  const percent = useMemo(() => Math.round((index / total) * 100), [index, total])

  function submit() {
    if (selected == null) return
    if (selected === current.answerIndex) setCorrectCount((c) => c + 1)

    if (index + 1 < total) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setDone(true)
      // Set progress to 100% on completion for now (later: combine with content read)
      setProgress(lessonSlug, 100)
    }
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setDone(false)
  }

  if (!current && !done) return null

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="text-base">{done ? "Quiz Complete" : `Question ${index + 1} of ${total}`}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!done ? (
          <>
            <p className="text-foreground">{current.prompt}</p>
            <ul className="space-y-2">
              {current.choices.map((choice, i) => {
                const isSelected = selected === i
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelected(i)}
                      aria-pressed={isSelected}
                    >
                      {choice}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div aria-hidden className="h-1 w-full overflow-hidden rounded bg-muted">
              <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Progress {percent}%</p>
          </>
        ) : (
          <>
            <p className="text-foreground">
              You scored {correctCount} / {total}.
            </p>
            <p className="text-sm text-muted-foreground">
              Great work. You can retake the quiz to improve your score anytime.
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        {!done ? (
          <>
            <Button variant="secondary" onClick={restart} className="min-w-24">
              Reset
            </Button>
            <Button onClick={submit} className="min-w-24">
              {index + 1 < total ? "Next" : "Finish"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={restart}>
              Retake
            </Button>
            <Button asChild>
              <a href="/learn">Back to Lessons</a>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
