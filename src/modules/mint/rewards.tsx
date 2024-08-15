import Image from 'next/image'

import { Button } from '@/components/ui/button'

export function Rewards() {
  return (
    <div className="container pt-8">
      <div className="text-2xl font-semibold -tracking-[0.0075em] text-neutral-900 lg:text-3xl">
        Campaign Statistics & Rewards
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-0">
        <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-r-none">
          <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
            <div className="text-xl -tracking-[0.005em]">Sprint</div>
            <div className="text-2xl -tracking-[0.006em]">1</div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-neutral-200 bg-slate-50 py-5">
            <Image src="/icon/timer.svg" alt="timer" width={24} height={24} />
            <div className="text-sm leading-6 text-neutral-900">
              <span className="font-bold">13 </span>
              <span>Days, </span>
              <span className="font-bold">20 </span>
              <span>Hours</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-none lg:border-l-0">
          <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
            <div className="text-xl -tracking-[0.005em]">Reward Pool</div>
            <div className="text-2xl -tracking-[0.006em]">9,999.99 ETH</div>
          </div>
          <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
            <Button className="rounded-full">How to Earn Rewards</Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-none lg:border-l-0">
          <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
            <div className="text-xl -tracking-[0.005em]">My Power</div>
            <div className="text-2xl -tracking-[0.006em]">2,000</div>
          </div>
          <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
            <Button className="rounded-full text-sm underline" variant="ghost">
              What’s My Power?
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-l-none lg:border-l-0">
          <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
            <div className="text-xl -tracking-[0.005em]">My ZK Reward</div>
            <div className="text-2xl -tracking-[0.006em]">123,456 ZK</div>
          </div>
          <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
            <Button className="rounded-full">Claim Rewards</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
