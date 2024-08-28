import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getLeaderboard } from '@/lib/endpoints'
import { cn } from '@/lib/utils'

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

export async function Leaderboard() {
  // fetch leader board data
  const leaderboard: LeaderboardData[] = (await getLeaderboard()).items

  return (
    <div className={cn('container mt-16')}>
      <div
        className={cn(
          'text-3xl font-semibold -tracking-[0.0075em] text-neutral-900',
        )}
      >
        Leaderboard
      </div>
      <div
        className={cn(
          'mt-8 overflow-hidden rounded-[6px] border border-neutral-200',
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Wallet address</TableHead>
              <TableHead>NFT Balance</TableHead>
              <TableHead>Imagine Power</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((item, index) => (
              <TableRow key={item.epoch_address}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.epoch_address}</TableCell>
                <TableCell>{item.mint_count}</TableCell>
                <TableCell>{item.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
