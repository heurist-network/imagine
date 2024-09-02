'use client'

import { ArrowIcon } from '@/components/icon'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'

import { Button } from './button'

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    className="rounded-full flex font-semibold bg-[#CDF138] text-black transition-all gap-2 group touch-manipulation hover:bg-[#CDF138]/90 active:translate-y-0.5"
                    onClick={openConnectModal}
                  >
                    <span>Connect Wallet</span>
                    <ArrowIcon
                      className="transition-transform w-[14px] group-hover:rotate-45"
                      strokeWidth={4}
                    />
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="rounded-full flex font-semibold bg-[#CDF138] text-black transition-all gap-2 group touch-manipulation hover:bg-[#CDF138]/90"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button
                    className="rounded-full font-semibold bg-[#CDF138] text-black transition-all gap-1 hover:bg-[#CDF138]/90 active:translate-y-0.5"
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <Button
                    className="rounded-full flex font-semibold bg-[#CDF138] text-black transition-all gap-2 hover:bg-[#CDF138]/90 active:translate-y-0.5"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
