import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Share({ params }: { params: { slug: string } }) {
  const { slug } = params

  const url = `https://d1dagtixswu0qn.cloudfront.net/${slug}.png`

  return (
    <div className="container py-16 pb-20 text-center">
      <div className="mb-2 flex justify-center">
        <Image
          className="rounded-md"
          src={url}
          alt="imagine"
          width={500}
          height={500}
        />
      </div>

      <div className="flex justify-center gap-2">
        <Link href="/">
          <Button variant="secondary" size="sm">
            Redirect to Index
          </Button>
        </Link>
        <Link href={url} download>
          <Button size="sm" variant="outline">
            Download
          </Button>
        </Link>
      </div>
    </div>
  )
}
