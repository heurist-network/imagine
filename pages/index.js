import { useTranslation } from 'next-i18next'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import ImageBox from '@/components/ImageBox/Index.jsx'
import ImageDemo from '@/components/ImageBox/demo'
import TopNav from '@/components/TopNav'
import style from "./index.module.scss";

const Homepage = ({ imageJson }) => {
  const { t } = useTranslation(['common', 'footer'])
  console.log('imageJson : --', imageJson);
  return (
    <>
      <main className={style.root}>
        <TopNav />
        <div className='content'>
          <div className="welcome_text">Welcome to <span>Heurist</span></div>
          <h1>
            We host best Stable Diffusion models on <span style={{ color: '#C57CFF' }}>fast GPUs</span> and offer them at <span style={{ color: '#FF7CCB' }}>low price</span>.
          </h1>
          <p className='text'>
            <span> $0.0015 </span>to generate a 512x512 image. <span> 99.9% </span>reliability in last 30 days.
          </p>
          <ImageBox imageJson={imageJson} />
        </div>
        {/* <ImageDemo /> */}
      </main >
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
