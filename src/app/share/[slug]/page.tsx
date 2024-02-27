import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Share() {
  return (
    <div className="container pt-16 text-center">
      <Link href="/">
        <Button variant="secondary">Redirect to Index</Button>
      </Link>
    </div>
  )
}
