import { useTranslation } from 'next-i18next'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import Link from '@/components/Link'

const Homepage = () => {
  const { t } = useTranslation(['common', 'footer'])

  return (
    <>
      <main>

      </main>
    </>
  )
}

export default Homepage

const getStaticProps = makeStaticProps(['common', 'footer'])
export { getStaticPaths, getStaticProps }
