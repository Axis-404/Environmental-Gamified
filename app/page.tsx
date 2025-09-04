"use client"

import AppShell from "@/components/app-shell"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Target, Trophy, User } from "lucide-react"

export default function Page() {
  return (
    <AppShell title="EcoLearn">
      <section className="space-y-6">
        <div className="space-y-2">
          <motion.h2
            className="text-balance text-3xl font-semibold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            Learn. Act. Earn Eco‑Points.
          </motion.h2>
          <motion.p
            className="leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            Take bite-sized lessons, complete real-world challenges like tree planting and waste segregation, and climb
            your school leaderboard.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/learn" className="flex items-start gap-3 rounded-xl border bg-card p-4 hover:bg-muted">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Start Learning</h3>
                <p className="text-sm text-muted-foreground">Interactive lessons and quizzes</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/challenges" className="flex items-start gap-3 rounded-xl border bg-card p-4 hover:bg-muted">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Target className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Join Challenges</h3>
                <p className="text-sm text-muted-foreground">Earn eco‑points with real tasks</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/leaderboard" className="flex items-start gap-3 rounded-xl border bg-card p-4 hover:bg-muted">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Leaderboards</h3>
                <p className="text-sm text-muted-foreground">Compete by class and school</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/profile" className="flex items-start gap-3 rounded-xl border bg-card p-4 hover:bg-muted">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <User className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Your Profile</h3>
                <p className="text-sm text-muted-foreground">Badges, streaks, and progress</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </AppShell>
  )
}
