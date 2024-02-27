"use server";

import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Generate from "@/modules/generate";
import History from "@/modules/generate/history";

export default async function Models({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [model, author] = slug.split("-");
  if (!model || !author) return notFound();

  try {
    const model1 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`
    ).then((res) => res.json());
    const model2 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`
    ).then((res) => res.json());
    const model3 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`
    ).then((res) => res.json());

    const models = [
      { label: model, data: model1 },
      { label: `${model}-2`, data: model2 },
      { label: `${model}-3`, data: model3 },
    ];

    return (
      <main className="flex-1">
        <div className="container pt-8 pb-20">
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
              <TabsTrigger value="history" className="gap-1 items-end">
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
    );
  } catch (error) {
    return notFound();
  }
}
