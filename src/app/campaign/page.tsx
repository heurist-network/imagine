import { Suspense } from 'react'

import { VotingComponent } from '@/components/VotingComponent'
import { FeatureModel } from '@/modules/campaign/feature-model'
import { Leaderboard } from '@/modules/campaign/leaderboard'
import { CampaignPreview } from '@/modules/campaign/preview'
import { CampaignReward } from '@/modules/campaign/reward'

// Seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Fisher-Yates shuffle algorithm with seeded randomness
function shuffleArray(array: any[], seed: number) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed++) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function NewCampaign() {
  const res: any[] = await fetch(
    'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
    {
      next: { revalidate: 3600 },
    },
  ).then((res) => res.json())

  const imageModels = res.filter(
    (item) =>
      item.type === 'sd15' ||
      item.type === 'sdxl10' ||
      item.type.includes('composite'),
  )

  // Get current date and use it as seed
  const today = new Date()
  let seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  // Filter SD15 items and randomly select one
  const sd15Lists = imageModels.filter((item) => item.type.includes('15'))
  const randomIndex = Math.floor(seededRandom(seed) * sd15Lists.length)
  const firstItem = sd15Lists[randomIndex]

  // Create a list of all other items, including remaining SD15 models
  const otherLists = imageModels.filter((item) => item !== firstItem)
  const shuffledOther = shuffleArray(otherLists, seed)

  // Select three more items from the shuffled other list
  const additionalItems = shuffledOther.slice(0, 3)

  // Combine the selections
  const selectedLists = [firstItem, ...additionalItems]

  // Shuffle the selected lists (except the first one) to randomize their order
  const finalLists = [
    selectedLists[0],
    ...shuffleArray(selectedLists.slice(1), seed),
  ]

  return (
    <main className="flex-1">
      <CampaignPreview />
      <CampaignReward />
      <VotingComponent />
      <Suspense>
        <FeatureModel lists={finalLists} />
      </Suspense>
      <Leaderboard />
    </main>
  )
}
