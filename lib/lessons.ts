// Simple in-memory lessons stub for UI scaffolding.
// Replace with database/API later.

export type QuizQuestion = {
  id: string
  prompt: string
  choices: string[]
  answerIndex: number
}

export type Lesson = {
  slug: string
  title: string
  duration: string
  summary: string
  content: string[]
  quiz: QuizQuestion[]
}

export const lessons: Lesson[] = [
  {
    slug: "waste-segregation-101",
    title: "Waste Segregation 101",
    duration: "5 min",
    summary: "Learn how to separate dry and wet waste at home and school.",
    content: [
      "Segregating waste reduces landfill burden and makes recycling more effective.",
      "Use two clearly labeled bins: Wet (organic) and Dry (recyclable).",
      "Rinse containers before placing them in dry waste to avoid contamination.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which bin should fruit peels go into?",
        choices: ["Dry", "Wet", "E-waste", "None"],
        answerIndex: 1,
      },
      {
        id: "q2",
        prompt: "Rinsing containers before recycling helps because:",
        choices: [
          "It adds more water to the bin",
          "It prevents contamination and odors",
          "It makes items heavier",
          "It is not necessary",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    slug: "local-biodiversity",
    title: "Local Biodiversity",
    duration: "7 min",
    summary: "Understand native species and how to support them in your area.",
    content: [
      "Biodiversity supports ecosystem services like pollination and clean water.",
      "Plant native species to support local birds and insects.",
      "Avoid invasive plants that outcompete native species.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Planting native species helps because:",
        choices: [
          "They require the most water",
          "They support local wildlife and adapt better",
          "They grow slower",
          "They are always cheaper",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    slug: "water-conservation-basics",
    title: "Water Conservation Basics",
    duration: "6 min",
    summary: "Practical tips to use less water every day.",
    content: [
      "Fix leaking taps to save significant amounts of water.",
      "Collect rainwater for gardening where possible.",
      "Turn off the tap while brushing your teeth.",
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which is a good water-saving habit?",
        choices: [
          "Leave tap on while brushing",
          "Fix leaks promptly",
          "Use bucket and shower together",
          "Ignore running toilets",
        ],
        answerIndex: 1,
      },
    ],
  },
]
