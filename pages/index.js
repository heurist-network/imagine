import { useTranslation } from 'next-i18next'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import ImageBox from '@/components/ImageBox/Index.jsx'
import ImageDemo from '@/components/ImageBox/demo'

import Link from '@/components/Link'

const Homepage = ({ imageJson }) => {
  const { t } = useTranslation(['common', 'footer'])
  console.log('imageJson : --', imageJson);
  return (
    <>
      <main>
        <ImageBox imageJson={imageJson} />
        {/* <ImageDemo /> */}
      </main>
    </>
  )
}

export default Homepage

export async function getStaticProps() {
  const res = await fetch('https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json')
  const imageJson = await res.json()
  // const imageJson = []
  console.log('repo: --', imageJson);
  return {
    props: {
      imageJson
    },
    revalidate: 30,
  }
}
