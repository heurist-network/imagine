'use client'

import React from 'react'

import { useVoting } from '../hooks/useVoting'

export const VotingComponent: React.FC = () => {
  const { images, selectedImage, selectImage, submitVote } = useVoting()

  const handleVote = () => {
    submitVote()
  }

  return (
    <div>
      <h2>Select Your Favorite NFT Image</h2>
      <div>
        {images.map((image) => (
          <div key={image.id} onClick={() => selectImage(image)}>
            <img src={image.imageUrl} alt={`NFT ${image.id}`} />
          </div>
        ))}
      </div>
      <button onClick={handleVote} disabled={!selectedImage}>
        Vote
      </button>
    </div>
  )
}
