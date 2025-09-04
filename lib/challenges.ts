export type Challenge = {
  slug: string
  title: string
  points: number
  description: string
  requirements: string[]
  requirePhoto?: boolean
  requireQR?: boolean
  requireGeo?: boolean
}

export const challenges: Challenge[] = [
  {
    slug: "plant-a-native-sapling",
    title: "Plant a native sapling",
    points: 100,
    description:
      "Plant a native tree or shrub in your locality. Water it regularly and ensure it is protected with a guard if possible.",
    requirements: [
      "Take a clear photo of the planted sapling (avoid faces)",
      "Scan or enter event QR (if provided by school/NGO)",
      "Capture location near the planting site",
    ],
    requirePhoto: true,
    requireQR: true,
    requireGeo: true,
  },
  {
    slug: "home-waste-audit",
    title: "Home waste audit",
    points: 80,
    description:
      "Track your household waste for a day. Separate into wet and dry waste. Note quantities and observations.",
    requirements: [
      "Upload a photo of segregated waste bins (avoid faces)",
      "Enter notes about quantities and observations",
    ],
    requirePhoto: true,
    requireQR: false,
    requireGeo: false,
  },
  {
    slug: "reusable-bottle-week",
    title: "Carry a reusable bottle for a week",
    points: 60,
    description:
      "Carry a reusable water bottle to reduce plastic waste. Log your habit for 7 days with a quick daily note.",
    requirements: ["Optional daily photo", "No QR required"],
    requirePhoto: false,
    requireQR: false,
    requireGeo: false,
  },
]
