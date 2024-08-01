// 'use server'

import { notFound } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Generate from '@/modules/generate'
import History from '@/modules/generate/history'
import PDAs from '@/modules/generate/pdas'
import { Author } from '@/modules/models/author'

export const maxDuration = 30

export default async function Models({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [model] = slug.split('-')
  if (!model) return notFound()

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

    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())

    const findModel = res.find((item) => item.name === model)

    const models = [
      { label: model, data: model1 },
      { label: `${model}-2`, data: model2 },
      { label: `${model}-3`, data: model3 },
    ]

    return (
      <main className="flex-1">
        <div className="container pt-8 pb-20">
          <h2 className="font-semibold tracking-tight pb-2 text-3xl scroll-m-20 first:mt-0">
            {model}
          </h2>
          <Author model={model} />
          <Separator className="my-6" />
          <Tabs defaultValue="generate">
            <TabsList>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="history" className="gap-1 items-end">
                History
                <span className="text-muted-foreground">(Latest 50)</span>
              </TabsTrigger>
              {/* <TabsTrigger value="pdas" className="gap-1 items-end">
                PDAs
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="generate">
              <Generate
                model={model}
                models={models}
                isXl={findModel?.type?.endsWith('xl')}
              />
            </TabsContent>
            <TabsContent value="history">
              <History model={model} />
            </TabsContent>
            <TabsContent value="pdas">
              <PDAs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className="flex-1">
        <div className="container pt-8 pb-20">
          <h2 className="font-semibold tracking-tight pb-2 text-3xl scroll-m-20 first:mt-0">
            {model}
          </h2>
          <Author model={model} />
          <Separator className="my-6" />
          <Tabs defaultValue="generate">
            <TabsList>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="history" className="gap-1 items-end">
                History
                <span className="text-muted-foreground">(Latest 50)</span>
              </TabsTrigger>
              {/* <TabsTrigger value="pdas" className="gap-1 items-end">
                PDAs
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="generate">
              <Generate model={model} models={[]} />
            </TabsContent>
            <TabsContent value="history">
              <History model={model} />
            </TabsContent>
            <TabsContent value="pdas">
              <PDAs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  }
}
