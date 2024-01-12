"use client";
import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { Button } from 'antd';
import TopNav from '@/components/TopNav'

import style from "./index.module.scss";

function Model({ model }) {
  const [data, setData] = useState("data Model");

  useEffect(() => {
    console.log('-- model --', model);
  }, []);
  return (
    <div className={style.root}>
      <TopNav />
      <div className={style.root}>

      </div>
      <div className='image-box'>

        <Image
          width={512}
          height={500}
          priority
          // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
          src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
          alt="模型图片"
        />
      </div>
    </div>
  )
}
export default Model
export function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          model: 'next.js',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}
export function getStaticProps({ params }) {
  const { model } = params;

  console.log('model--', model);
  return {
    props: {
      model
    }
  }
}