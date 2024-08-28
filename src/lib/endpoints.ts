import { getAddress } from 'viem'

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
 * >> API endpoint for fetching user rewards.
 */
export interface UserRewardsData {
  address: string
  epoch: string
  score: number
  pool1_rewards: number
  pool2_rewards: number
  ranking: number
  mint_count: number
}

export const API_USER_REWARDS =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/user-rewards'

/**
 * Fetches user rewards for a given address and optional epoch.
 * @param {string} address - The user's address.
 * @param {string} [epoch] - Optional epoch parameter.
 * @returns {Promise<UserRewardsData>} A promise that resolves to the user rewards data.
 */
export const getUserRewards = async (
  address: string,
  epoch?: string,
): Promise<UserRewardsData> => {
  try {
    const params = new URLSearchParams({ address })
    const lowerCaseAddress = address.toLowerCase()

    params.set('address', lowerCaseAddress)
    if (epoch) params.append('epoch', epoch)
    const response = await fetch(`${API_USER_REWARDS}?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: UserRewardsData = await response.json()
    console.log('debug user rewards', data)
    return data
  } catch (error) {
    console.error('Error fetching user rewards:', error)
    return {
      address: address,
      epoch: epoch || '',
      score: 0,
      pool1_rewards: 0,
      pool2_rewards: 0,
      ranking: 0,
      mint_count: 0,
    }
  }
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

export interface LeaderboardResponse {
  items: LeaderboardData[]
  pageInfo: {
    currentPage: number
    hasNextPage: boolean
    nextPage: number
  }
}

export const API_LEADERBOARD =
  'https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/leaderboard-stats'

/**
 * Fetches leaderboard data for a specific epoch and page.
 * @param {string} [epoch] - Optional epoch parameter (e.g., 'EPOCH_10').
 * @param {number} [page] - Optional page number, defaults to 1.
 * @returns {Promise<LeaderboardResponse>} A promise that resolves to a LeaderboardResponse object.
 * @throws {Error} If the fetch request fails or returns a non-OK status.
 */
export const getLeaderboard = async (
  epoch?: string,
  page: number = 1,
): Promise<LeaderboardResponse> => {
  const params = new URLSearchParams()
  if (epoch) params.append('epoch', epoch)
  params.append('page', page.toString())

  const url = `${API_LEADERBOARD}?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: LeaderboardResponse = await response.json()
    console.log('debug leaderboard', data)
    return data
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    // Return default data if there's an error
    return {
      items: [],
      pageInfo: {
        currentPage: page,
        hasNextPage: false,
        nextPage: page,
      },
    }
  }
}
