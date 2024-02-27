"use server";

import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ModelsWrapper,
  ImageWrapper,
  ModelsTitle,
} from "@/components/motion/modelsWrapper";

export async function Models() {
  try {
    const res: any[] = await fetch(
      "https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json"
    ).then((res) => res.json());

    const lists = res.filter(
      (item) => item.type === "sd15" || item.type === "sdxl10"
    );

    if (!lists.length) return null;

    // console.log("--------------------------------------");
    // console.log("\n\n");
    // console.log(JSON.stringify(lists), "lists");
    // console.log("\n\n");
    // console.log("--------------------------------------");

    // const lists = [
    //   {
    //     name: "BrainDance",
    //     author: "br_d",
    //     type: "sd15",
    //     info_url: "https://civitai.com/models/102753?modelVersionId=128189",
    //     file_url: "https://files.heurist.xyz/braindance_BD071.safetensors",
    //     vae: "vae-ft-mse-840000-ema-pruned",
    //     dtype: "float16",
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "BlazingDrive",
    //     author: "br_d",
    //     type: "sd15",
    //     info_url: "https://civitai.com/models/121083/blazing-drive",
    //     file_url: "https://files.heurist.xyz/blazingDrive_V12g.safetensors",
    //     vae: "vae-ft-mse-840000-ema-pruned",
    //     dtype: "float16",
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "BluePencilRealistic",
    //     author: "blue_pen5805",
    //     type: "sd15",
    //     info_url:
    //       "https://civitai.com/models/88941/bluepencilrealistic?modelVersionId=110838",
    //     file_url:
    //       "https://files.heurist.xyz/bluePencilRealistic_v1.safetensors",
    //     vae: "vae-ft-mse-840000-ema-pruned",
    //     dtype: "float16",
    //     clip_skip: 2,
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "YamersCartoonArcadia",
    //     author: "Yamer",
    //     type: "sd15",
    //     info_url:
    //       "https://civitai.com/models/136113/sdxl-yamers-cartoon-arcadia?modelVersionId=274947",
    //     file_url:
    //       "https://files.heurist.xyz/sdxlYamersCartoonArcadia_xenoArcadiaCD.safetensors",
    //     vae: "Liquid0111vae",
    //     dtype: "float16",
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "HelloWorldFilmGrain",
    //     author: "LEOSAM",
    //     type: "sd15",
    //     info_url: "https://civitai.com/models/43977?modelVersionId=113623",
    //     file_url:
    //       "https://files.heurist.xyz/leosamsHelloworldSDXL_filmGrain20.safetensors",
    //     dtype: "float16",
    //     clip_skip: 2,
    //     size_mb: 5170,
    //   },
    //   {
    //     name: "ArthemyComics",
    //     author: "Arthemy",
    //     type: "sd15",
    //     info_url:
    //       "https://civitai.com/models/54073/arthemy-comics?modelVersionId=255415",
    //     file_url: "https://files.heurist.xyz/arthemyComics_v60.safetensors",
    //     dtype: "float16",
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "ArthemyReal",
    //     author: "Arthemy",
    //     type: "sd15",
    //     info_url:
    //       "https://civitai.com/models/240547/arthemy-real?modelVersionId=271398",
    //     file_url: "https://files.heurist.xyz/arthemyReal_v10.safetensors",
    //     dtype: "float16",
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "ChosenChineseStyle",
    //     author: "chosen",
    //     type: "sd15",
    //     info_url:
    //       "https://civitai.com/models/95643/chosen-chinese-stylensfw-hentai?modelVersionId=219960",
    //     file_url:
    //       "https://files.heurist.xyz/ChosenChineseStyleNsfw_v20.safetensors",
    //     dtype: "float16",
    //     clip_skip: 2,
    //     size_mb: 2150,
    //   },
    //   {
    //     name: "SDXLUnstableDiffusersV11",
    //     author: "Yamer",
    //     type: "sdxl10",
    //     info_url:
    //       "https://civitai.com/models/84040/sdxl-unstable-diffusers-yamermix",
    //     file_url:
    //       "https://files.heurist.xyz/sdxlUnstableDiffusers_v11.safetensors",
    //     dtype: "float16",
    //     size_mb: 6950,
    //   },
    // ];

    return (
      <div className="pb-20">
        <ModelsTitle>Deployed Models</ModelsTitle>
        <ModelsWrapper>
          {lists.map((item, index) => (
            <Link key={item.name} href={`/models/${item.name}-${item.author}`}>
              <ImageWrapper name={item.name} index={index}>
                <Image
                  className="w-full h-auto hover:scale-105 transition-transform"
                  width={280}
                  height={400}
                  priority
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.png`}
                  alt="models image"
                />
              </ImageWrapper>
            </Link>
          ))}
        </ModelsWrapper>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
