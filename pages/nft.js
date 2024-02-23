import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';
import signatures from './data/signatures.json';

const claimNFTAbi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32"
      },
      {
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "claimNFT",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const account = useAccount();
  const [walletAddress, setWalletAddress] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [claimed, setClaimed] = useState(false);
  
  // smart contract call data
  const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  const [hash, setHash] = useState(undefined);
  const [signature, setSignature] = useState(undefined);

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address.toLowerCase());
    } else {
      setWalletAddress(undefined);
    }
  }, [account]);

  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      setIsError(false);

      const imageUrl = `https://imaginaries.heurist.ai/${walletAddress}.png`;
      fetch(imageUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Image not found');
          }

          // load the hash and signature from the signatures.json file
          const claimant = signatures.find(claimant => claimant.address === walletAddress); // already lowercased
          if (!claimant) {
            console.error('Address not found in signatures.json');
            throw new Error('Address not found');
          }

          setHash(claimant.hash);
          setSignature(claimant.signature);
          setImageUrl(imageUrl);
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // User has disconnected their wallet
      setImageUrl(null);
      setIsLoading(false);
      setIsError(false);
      setHash(undefined);
      setSignature(undefined);
      setClaimed(false);
    }
  }, [walletAddress]);

  const handleClaim = () => {
    console.log('Claim function triggered');

    writeContract({ 
      abi: claimNFTAbi,
      address: contractAddress,
      functionName: 'claimNFT',
      args: [
        hash,
        signature,
      ],
   }, {
    onSuccess: () => {
      console.log('Success');
      setClaimed(true);
    }
   });
  };

  return (
    <div className="flex justify-center mt-20">
      <ConnectButton />
      {isLoading && <p>Loading...</p>}
      {isError && <p>You are not eligible. Stay tuned for the next round of Imaginaries NFT airdrop!</p>}
      {imageUrl && (
        <>
          <img src={imageUrl} alt="Heurist Imaginary" />
          {claimed ? (
            <button disabled>Already claimed</button>
          ) : (
            <button onClick={handleClaim}>Claim</button>
          )}
        </>
      )}
    </div>
  );
}
