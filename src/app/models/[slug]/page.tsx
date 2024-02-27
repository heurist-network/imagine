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

    // console.log(JSON.stringify(models), "models");

    // const models = [
    //   {
    //     label: "BlazingDrive",
    //     data: {
    //       prompt:
    //         "girl, simple background, side shot, ultra detailed, mecha, cyber full face helmet, goggles, Illustrate a translucent watercolor painting, with delicate washes of color, subtle blending, and an airy, dreamlike quality",
    //       neg_prompt: "worst quality, nsfw",
    //       seed: 2795363458,
    //       width: 512,
    //       height: 768,
    //       num_inference_steps: 30,
    //       guidance_scale: 6.5,
    //       sampler: {
    //         class_name: "DPMSolverMultistepScheduler",
    //         use_karras_sigmas: true,
    //         algorithm_type: "sde-dpmsolver++",
    //       },
    //     },
    //   },
    //   {
    //     label: "BlazingDrive-2",
    //     data: {
    //       prompt:
    //         "Watercolor illustration of a dreamy girl in a sundress, walking in a field of wildflowers at sunset, Anime-style portrait of a teenage girl with sparkling blue eyes and a gentle smile,",
    //       neg_prompt: "worst quality, nsfw",
    //       seed: 3717059370,
    //       width: 512,
    //       height: 768,
    //       num_inference_steps: 41,
    //       guidance_scale: 9.5,
    //       sampler: {
    //         class_name: "DPMSolverMultistepScheduler",
    //         use_karras_sigmas: true,
    //         algorithm_type: "sde-dpmsolver++",
    //       },
    //     },
    //   },
    //   {
    //     label: "BlazingDrive-3",
    //     data: {
    //       prompt:
    //         "Girl, Orange Flower Crown, shallow depth of field, Proud, two colors",
    //       neg_prompt: "worst quality, nsfw",
    //       seed: 2795363458,
    //       width: 512,
    //       height: 768,
    //       num_inference_steps: 40,
    //       guidance_scale: 9.5,
    //       sampler: {
    //         class_name: "DPMSolverMultistepScheduler",
    //         use_karras_sigmas: true,
    //         algorithm_type: "sde-dpmsolver++",
    //       },
    //     },
    //   },
    // ];

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
