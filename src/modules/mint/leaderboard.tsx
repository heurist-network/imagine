import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  {
    invoice: 'INV001',
    walletAddress: '0xabcd...1234',
    nftBalance: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    walletAddress: '0xabcd...1234',
    nftBalance: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    walletAddress: '0xabcd...1234',
    nftBalance: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    walletAddress: '0xabcd...1234',
    nftBalance: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    walletAddress: '0xabcd...1234',
    nftBalance: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    walletAddress: '0xabcd...1234',
    nftBalance: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV008',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV009',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV010',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV011',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export function Leaderboard() {
  return (
    <div className="container mt-16">
      <div className="text-3xl font-semibold -tracking-[0.0075em] text-neutral-900">
        Mint Leaderboard
      </div>
      <div className="mt-8 overflow-hidden rounded-[6px] border border-neutral-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px] text-neutral-900">Rank</TableHead>
              <TableHead className="text-neutral-900">Wallet address</TableHead>
              <TableHead className="text-neutral-900">NFT Balance</TableHead>
              <TableHead className="text-right text-neutral-900">
                Imagine Power
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">
                  {index + 1 < 10 ? '0' + (index + 1) : index + 1}
                </TableCell>
                <TableCell>{invoice.walletAddress}</TableCell>
                <TableCell>{invoice.nftBalance}</TableCell>
                <TableCell className="text-right">
                  {invoice.paymentMethod}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
