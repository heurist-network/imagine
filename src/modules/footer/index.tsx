import Link from 'next/link'

import { HeuristIcon } from '@/components/icon'

export function Footer() {
  return (
    <div className="bg-[#1d1d1c]">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-[120px] md:max-w-[1440px]">
        <div className="flex w-full flex-col-reverse gap-10 lg:flex-row lg:gap-0">
          <div className="flex basis-2/3">
            <div className="flex basis-1/2 flex-col gap-4 font-SFMono">
              <div className="text-[16px] leading-[1.5] -tracking-[0.01em] text-[#696963]">
                Community
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href=""
                >
                  Ecosystem
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href=""
                >
                  Developer
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href=""
                >
                  Mining
                </Link>
              </div>
            </div>
            <div className="flex basis-1/2 flex-col items-start gap-4 font-SFMono">
              <div className="text-[16px] leading-[1.5] -tracking-[0.01em] text-[#696963]">
                Follow us
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href=""
                >
                  Discord
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href=""
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
          <div className="basis-1/3 text-[16px] leading-[1.5] -tracking-[0.0016em] text-[#FFFFFF] lg:text-right">
            Serverless Access To A World Of Open-SourceAI Models Powered By A ZK
            Layer-2 Network
          </div>
        </div>
        <HeuristIcon className="mt-16 w-full" />
        <div className="my-16 h-[1px] bg-[#393936]" />
        <div className="flex flex-col justify-between gap-2 font-SFMono text-[14px] leading-[1.71] -tracking-[0.01em] text-[#696963] lg:flex-row lg:gap-0">
          <div>©2024 Heurist All rights reserved</div>
          <div>Terms and Conditions</div>
        </div>
      </div>
    </div>
  )
}
