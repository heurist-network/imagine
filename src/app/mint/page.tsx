import { notFound } from 'next/navigation'

import { FeatureModels } from '@/modules/mint/featureModels'
import { Leaderboard } from '@/modules/mint/leaderboard'
import { Rewards } from '@/modules/mint/rewards'

export default async function Mint() {
  try {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())

    const lists = res.filter(
      (item) =>
        item.type === 'sd15' ||
        item.type === 'sdxl10' ||
        item.type.includes('composite'),
    )

    return (
      <main className="flex flex-1 flex-col pb-20">
        <Rewards />

        <FeatureModels lists={lists} />

        <Leaderboard />
      </main>
    )
  } catch (error) {
    return notFound()
  }
}
