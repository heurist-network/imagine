'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Chain, mainnet } from 'viem/chains'
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { env } from '@/env.mjs'
import signatures from '@data/signatures.json'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const claimNFTAbi = [
  {
    constant: false,
    inputs: [
      {
        name: 'hash',
        type: 'bytes32',
      },
      {
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'claimNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export function NFTModule() {
  const account = useAccount()
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [hash, setHash] = useState('')
  const [signature, setSignature] = useState('')
  const [claimed, setClaimed] = useState(false)

  const { writeContract } = useWriteContract()
  const { switchChain } = useSwitchChain()

  const handleClaim = () => {
    console.log('Claim function triggered')

    switchChain({ chainId: mainnet.id })

    writeContract(
      {
        abi: claimNFTAbi,
        address: env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
        functionName: 'claimNFT',
        args: [hash, signature],
        chain: mainnet as Chain, // mainnet
      },
      {
        onSuccess: () => {
          console.log('Success')
          setClaimed(true)
        },
        onError: (error) => {
          if (error.message.includes('Signature used')) {
            console.log('already used')
            setClaimed(true)
          } else {
            console.error('Error', error)
            alert(`Error: ${error.message}`)
          }
        },
      },
    )
  }

  useEffect(() => {
    switchChain({
      chainId: mainnet.id,
    })
  }, [account.chain])

  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address.toLowerCase())
    } else {
      setWalletAddress('')
    }
  }, [account])

  useEffect(() => {
    if (walletAddress) {
      setLoading(true)

      const imageUrl = `https://imaginaries.heurist.ai/${walletAddress}.png`

      fetch(imageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Image not found')
          }

          // load the hash and signature from the signatures.json file
          const claimant = signatures.find(
            (claimant) => claimant.address === walletAddress,
          ) // already lowercased

          if (!claimant) {
            console.error('Address not found in signatures.json')
            throw new Error('Address not found')
          }

          setHash(claimant.hash)
          setSignature(claimant.signature)
          setImageUrl(imageUrl)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
      setError(false)
      setImageUrl('')
      setHash('')
      setSignature('')
      setClaimed(false)
    }
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <Card className="mt-4 h-44 w-full">
        <CardHeader>
          <CardTitle className="text-center">
            Please, connect your wallet
          </CardTitle>
          <CardDescription className="text-center">
            Please connect wallet to Ethereum mainnet
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-16 justify-center">
          <ConnectButton />
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="mt-4 flex h-44 w-full items-center justify-center">
        <p className="text-center">Loading...</p>
      </Card>
    )
  }

  if (error) {
    console.error(error)
    return (
      <Card className="mt-4 flex h-44 w-full items-center justify-center">
        <p className="text-center">
          You are not eligible. Stay tuned for the next round of Imaginaries NFT
          airdrop!
        </p>
      </Card>
    )
  }

  if (imageUrl) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center gap-2">
        <Image
          src={imageUrl}
          alt="Heurist Imaginary"
          width={300}
          height={300}
        />
        {claimed ? (
          <Button disabled>Already claimed</Button>
        ) : (
          <Button onClick={handleClaim}>Claim</Button>
        )}
      </div>
    )
  }

  return null
}
