import { FeatureModel } from '@/modules/campaign/feature-model'
import { Leaderboard } from '@/modules/campaign/leaderboard'
import { CampaignPreview } from '@/modules/campaign/preview'
import { CampaignReward } from '@/modules/campaign/reward'

export default async function NewCampaign() {
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
    <main className="flex-1">
      <CampaignPreview />
      <CampaignReward />
      <FeatureModel lists={lists} />
      <Leaderboard />
    </main>
  )
}
