import { FeatureModel } from '@/modules/campaign/feature-model'
import { Leaderboard } from '@/modules/campaign/leaderboard'
import { CampaignPreview } from '@/modules/campaign/preview'
import { CampaignReward } from '@/modules/campaign/reward'

export default function NewCampaign() {
  return (
    <main className="flex-1">
      <CampaignPreview />
      <CampaignReward />
      <FeatureModel />
      <Leaderboard />
    </main>
  )
}
