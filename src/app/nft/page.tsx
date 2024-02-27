import { NFTModule } from '@/modules/nft'

export default function NFT() {
  return (
    <main className="flex-1">
      <div className="container pb-20 pt-8">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-3 py-8">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Heurist Imaginaries Airdrop
          </h1>
          <h3 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
            A gift for early supporters of Heurist.
          </h3>
          <p className="text-center text-lg text-muted-foreground">
            Imaginaries are a collection of 500 AI-generated NFTs generated by
            community-made Stable Diffusion models.
          </p>
          <NFTModule />
        </section>
      </div>
    </main>
  )
}
