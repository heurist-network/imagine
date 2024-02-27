import Image from "next/image";
import { Hero } from "@/modules/hero";
import { Models } from "@/modules/models";
import { OpacityWrapper } from "@/components/motion/opacityWrapper";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="container">
        <Hero />
        <OpacityWrapper>
          <div className="my-6 md:my-10 flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-[#ebeaeb]" />
            <Image src="/logo.svg" alt="logo" width={24} height={24} />
            <div className="flex-1 h-[1px] bg-[#ebeaeb]" />
          </div>
        </OpacityWrapper>
        <Models />
      </div>
    </main>
  );
}
