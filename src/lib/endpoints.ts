export const API_NOTIFY_IMAGE_GEN =
  'https://uoub6ss185.execute-api.us-east-1.amazonaws.com/prod/notify-image-gen'

/*
Name: notify-after-mint-actions
Method: POST
Payload:
 {
  "modelId": "model123",
  "imageId": "image456",
  "actionType": "GATEWAY_UPLOAD" / "TWITTER_SHARE"
}
*/
export const API_NOTIFY_AFTER_MINT_ACTIONS =
  'https://fkosy3nlq8.execute-api.us-east-1.amazonaws.com/prod/notify-after-mint-actions'

/**
 * API endpoint for fetching user rewards.
 */
export const API_USER_REWARDS =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/dev/user-rewards'

/**
 * Fetches user rewards for a given address and optional epoch.
 * @param {string} address - The user's address.
 * @param {string} [epoch] - Optional epoch parameter.
 * @returns {Promise<any>} A promise that resolves to the user rewards data.
 */
export const getUserRewards = async (address: string, epoch?: string) => {
  const params = new URLSearchParams({ address })
  if (epoch) params.append('epoch', epoch)
  const response = await fetch(`${API_USER_REWARDS}?${params}`)
  console.log('debug user rewards', await response.json())
  return response.json()
}

/**
 * API endpoint for fetching epoch rewards.
 */
export const API_EPOCH_REWARDS =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/dev/epoch-rewards'

/**
 * Fetches rewards for a specific epoch or the current epoch if not specified.
 * @param {string} [epoch] - Optional epoch parameter.
 * @returns {Promise<any>} A promise that resolves to the epoch rewards data.
 */
export const getEpochRewards = async (epoch?: string) => {
  const params = new URLSearchParams()
  if (epoch) params.append('epoch', epoch)
  const response = await fetch(
    `${API_EPOCH_REWARDS}${params.toString() ? `?${params}` : ''}`,
  )
  console.log('debug epoch rewards', await response.json())
  return response.json()
}

/**
 * API endpoint for fetching leaderboard data.
 */
export const API_LEADERBOARD =
  'https://gnjlmpxbsh.execute-api.us-east-1.amazonaws.com/dev/leaderboard'

/**
 * Fetches leaderboard data for a specific epoch or the current epoch if not specified.
 * @param {string} [epoch] - Optional epoch parameter (e.g., 'EPOCH_0').
 * @returns {Promise<LeaderboardData>} A promise that resolves to the leaderboard data.
 * @throws {Error} If the fetch request fails or returns a non-OK status.
 */
export const getLeaderboard = async (epoch?: string): Promise<any> => {
  const params = new URLSearchParams()
  if (epoch) params.append('epoch', epoch)

  const url = `${API_LEADERBOARD}${params.toString() ? `?${params}` : ''}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    console.log('debug leaderboard', await response.json())
    return await response.json()
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    throw error
  }
}
