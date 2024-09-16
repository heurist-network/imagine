'use client'

import { create } from 'zustand'

interface NFTImage {
  id: string
  imageUrl: string
  metadata: any
}

interface VotingState {
  images: NFTImage[]
  selectedImage: NFTImage | null
  setImages: (images: NFTImage[]) => void
  selectImage: (image: NFTImage) => void
}

export const useVotingStore = create<VotingState>((set) => ({
  images: [],
  selectedImage: null,
  setImages: (images) => set({ images }),
  selectImage: (image) => set({ selectedImage: image }),
}))
