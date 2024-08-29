# Module: src/app/mintToNFT

> Applied to `history` and `generate` modules.
>
>This module is responsible for minting a NFT after a user has generated an image.

## Developer Notes

### Overview
The `mintToNFT` module provides functionality for minting NFTs from generated images. It's primarily used in the 'history' and '/generate' modules.

### Key Components

1. **MintToNFT Component** (`dialog.tsx`)
   - Renders a button to trigger NFT minting
   - Handles different minting scenarios:
     - Regular minting
     - Signature-based free minting
     - Partner NFT-based free minting
   - Manages state for minting process, including loading states and error handling
   - Integrates with blockchain interactions using hooks from external libraries

2. **Custom Hook** (`hooks.ts`)
   - `useMintToNFT`: A custom Zustand store for managing minting-related state
   - Manages:
     - Loading state
     - Referral address

### Key Features

- **Multiple Minting Options**: Supports regular minting, signature-based free minting, and partner NFT-based free minting.
  - Regular minting:
    - User pays for the minting transaction
  - Signature-based free minting:
    - User pays for the minting transaction
  - Partner NFT-based free minting:
    - User pays for the minting transaction
- **Referral System**: Includes functionality for referral addresses, offering potential discounts.
