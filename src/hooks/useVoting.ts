import { useCallback, useEffect } from 'react'
import axios from 'axios'

import { useVotingStore } from '../stores/useVotingStore'
import { useZkImagine } from './useZkImagine'

export const useVoting = () => {
  const { images, setImages, selectedImage, selectImage } = useVotingStore()
  const { fetchTotalSupply, fetchTokenURI } = useZkImagine()

  // Fetch random NFT images from the blockchain
  const fetchRandomImages = useCallback(async () => {
    try {
      const totalSupply = await fetchTotalSupply()

      // TODO: Update the logic to fetch random images from the blockchain
      const randomTokenIds = Array.from({ length: 3 }, () =>
        BigInt(Math.floor(Math.random() * Number(totalSupply)) + 1),
      )

      const imagePromises = randomTokenIds.map(async (tokenId) => {
        const tokenURI = await fetchTokenURI(tokenId)
        const response = await axios.get(tokenURI as string)
        const metadata = response.data

        return {
          id: tokenId.toString(),
          imageUrl: metadata.image,
          metadata,
        }
      })

      const images = await Promise.all(imagePromises)
      setImages(images)
    } catch (error) {
      console.error('Error fetching random images:', error)
    }
  }, [fetchTotalSupply, fetchTokenURI, setImages])

  // Submit vote to the backend
  const submitVote = useCallback(async () => {
    if (!selectedImage) return

    try {
      const response = await axios.post('/api/vote', {
        imageId: selectedImage.id,
        metadata: selectedImage.metadata,
      })

      console.log('Vote submitted successfully:', response.data)
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }, [selectedImage])

  useEffect(() => {
    fetchRandomImages()
  }, [fetchRandomImages])

  return {
    images,
    selectedImage,
    selectImage,
    submitVote,
  }
}
