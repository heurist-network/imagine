// 'use server'

import { notFound } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Generate from '@/modules/generate'
import History from '@/modules/generate/history'

export const maxDuration = 30

export default async function Models({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [model, author] = slug.split('-')
  if (!model || !author) return notFound()

  try {
    const model1 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`,
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())
    const model2 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`,
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())
    const model3 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`,
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())

    const models = [
      { label: model, data: model1 },
      { label: `${model}-2`, data: model2 },
      { label: `${model}-3`, data: model3 },
    ]

    return (
      <main className="flex-1">
        <div className="container pb-20 pt-8">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {model}
          </h2>
          <p className="text-muted-foreground">
            Created by <b className="text-foreground">{author}</b>
          </p>
          <Separator className="my-6" />
          <Tabs defaultValue="generate">
            <TabsList>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="history" className="items-end gap-1">
                History
                <span className="text-muted-foreground">(Latest 10)</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="generate">
              <Generate model={model} models={models} />
            </TabsContent>
            <TabsContent value="history">
              <History model={model} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  } catch (error) {
    return notFound()
  }
}
