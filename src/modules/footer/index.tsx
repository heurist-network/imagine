import Link from 'next/link'

import { HeuristIcon } from '@/components/icon'

export function Footer() {
  return (
    <div className="bg-[#1d1d1c]">
      <div className="mx-auto max-w-5xl px-6 pt-[120px] pb-16 md:max-w-[1440px]">
        <div className="flex flex-col-reverse w-full gap-10 lg:flex-row lg:gap-0">
          <div className="flex basis-2/3">
            <div className="flex flex-col font-SFMono gap-4 basis-1/2">
              <div className="text-[16px] text-[#696963] leading-[1.5] -tracking-[0.01em]">
                About Heurist
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://heurist.ai"
                >
                  Protocol
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://heurist.ai/ecosystem"
                >
                  Ecosystem
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://heurist.ai/portal"
                >
                  Mining
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://docs.heurist.ai/"
                >
                  Docs
                </Link>
              </div>
            </div>
            <div className="flex flex-col font-SFMono gap-4 items-start basis-1/2">
              <div className="text-[16px] text-[#696963] leading-[1.5] -tracking-[0.01em]">
                Follow us
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://discord.com/invite/heuristai"
                  target="_blank"
                >
                  Discord
                </Link>
              </div>
              <div className="flex">
                <Link
                  className="flex text-white transition-colors hover:text-[#CDF138]"
                  href="https://twitter.com/heurist_ai"
                  target="_blank"
                >
                  Twitter/X
                </Link>
              </div>
            </div>
          </div>
          <div className="text-[#FFFFFF] text-[16px] leading-[1.5] -tracking-[0.0016em] basis-1/3 lg:text-right">
            Enjoy seamless access to a world of open source AI models Brought to
            you by Heurist
          </div>
        </div>
        <HeuristIcon className="mt-16 w-full" />
        <div className="bg-[#393936] h-[1px] my-16" />
        <div className="flex flex-col font-SFMono text-[14px] text-[#696963] leading-[1.71] -tracking-[0.01em] gap-2 justify-between lg:flex-row lg:gap-0">
          <div>©2024 Heurist All rights reserved</div>
          <div>Terms and Conditions</div>
        </div>
      </div>
    </div>
  )
}
