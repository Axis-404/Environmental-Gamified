"use client"

import { useEffect, useState, useCallback } from "react"

type ProgressMap = Record<string, number>

const STORAGE_KEY = "lessonProgress"

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function writeProgress(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore write errors (quota/private mode)
  }
}

export function useLessonProgress(slug?: string) {
  const [map, setMap] = useState<ProgressMap>({})

  useEffect(() => {
    setMap(readProgress())
  }, [])

  const setProgress = useCallback((lessonSlug: string, value: number) => {
    setMap((prev) => {
      const next = { ...prev, [lessonSlug]: Math.max(0, Math.min(100, value)) }
      writeProgress(next)
      return next
    })
  }, [])

  const getProgress = useCallback(
    (lessonSlug: string) => {
      return map[lessonSlug] ?? 0
    },
    [map],
  )

  return {
    progressMap: map,
    getProgress,
    setProgress,
    progress: slug ? (map[slug] ?? 0) : undefined,
  }
}
