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
 * >> API endpoint for fetching epoch rewards.
 */

export interface EpochRewardsData {
  pool1TotalRewards: number
  pool2TotalRewards: number
  epochCutoffTime: string
  currentEpoch: string
}
export const API_EPOCH_REWARDS =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/epoch-rewards'

/**
 * Fetches rewards for a specific epoch or the current epoch if not specified.
 * @param {string} [epoch] - Optional epoch parameter.
 * @returns {Promise<EpochRewardsData>} A promise that resolves to the epoch rewards data.
 */
export const getEpochRewards = async (
  epoch?: string,
): Promise<EpochRewardsData> => {
  const params = new URLSearchParams()
  if (epoch) params.append('epoch', epoch)
  const response = await fetch(
    `${API_EPOCH_REWARDS}${params.toString() ? `?${params}` : ''}`,
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data: EpochRewardsData = await response.json()
  console.log('debug epoch rewards', data)
  return data
}

/**
 * API endpoint for fetching user rewards.
 */
export const API_USER_REWARDS =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/user-rewards'

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
 * >> API endpoint for fetching leaderboard data.
 */

export interface LeaderboardData {
  epoch: number
  mint_count: number
  epoch_address: string
  ranking: number
  gateway_upload_count?: number
  score: number
  zk_cashback: number
  pay_in_eth: number
  twitter_share_count?: number
}

export const API_LEADERBOARD =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/leaderboard'

/**
 * Fetches leaderboard data for a specific epoch and page.
 * @param {string} [epoch] - Optional epoch parameter (e.g., 'EPOCH_10').
 * @param {number} [page] - Optional page number, defaults to 1.
 * @returns {Promise<LeaderboardData[]>} A promise that resolves to an array of leaderboard data.
 * @throws {Error} If the fetch request fails or returns a non-OK status.
 */
export const getLeaderboard = async (
  epoch?: string,
  page: number = 1,
): Promise<LeaderboardData[]> => {
  const params = new URLSearchParams()
  if (epoch) params.append('epoch', epoch)
  params.append('page', page.toString())

  const url = `${API_LEADERBOARD}?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('debug leaderboard', data)
    return data
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    throw error
  }
}
