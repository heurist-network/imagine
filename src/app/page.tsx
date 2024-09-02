import { FeatureModels } from '@/modules/featureModels'
import { Hero } from '@/modules/hero'

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeatureModels />
    </main>
  )
}
