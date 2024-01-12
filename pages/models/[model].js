"use client";
import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { Button } from 'antd';
import TopNav from '@/components/TopNav'
import { Input } from 'antd';
import { Slider } from 'antd';
import style from "./index.module.scss";

function Model({ model }) {
  const [data, setData] = useState("data Model");
  const [value, setValue] = useState("")
  const [num_iterations, setNumInterations] = useState(30)
  // const [value, setValue] = useState("")
  const [url, setUrl] = useState("")
  const getImage = async () => {
    const { data } = await fetch('/api/getImage', { method: 'POST', body: JSON.stringify({ prompt: 'girl', num_iterations }) }).then(res => res.json());
    console.log('--res data--', data);
    setUrl(data)
  }
  useEffect(() => {
    console.log('-- model --', model);
    // getImage()
  }, []);
  const valueChange = (e) => {
    console.log('设置value', e.target.value);
    setValue(e.target.value)
  }
  return (
    <div className={style.root}>
      <TopNav />
      <div className={style.root}>
        <div className="content">
          <div className="model_title_row">
            <span className="model_title">{model}</span>
          </div>
          <div className="model_creator">
            Created by
          </div>

          {model &&
            <div className='image-box'>
              <Image
                width={512}
                height={500}
                priority
                // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
                src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
                alt="模型图片"
              /></div>}

          <div className="input-form">
            <div className="input-item">
              <h3>Prompt</h3>
              <Input value={value} placeholder="Prompt" size='large' onChange={valueChange} />
            </div>
            <div className="input-item">
              <h3>Sampling Steps</h3>
              <Slider min={1} value={num_iterations} onChange={value => setNumInterations(value)} max={50} defaultValue={30} disabled={false} />
            </div>
            {/* <div className="input-item">
              <h3>Guidance Scale</h3>
              <Slider min={1} value={scaleNumber} max={50} defaultValue={30} disabled={false} />
            </div> */}
            <div className="input-item">
              <Button onClick={getImage} size='large' type='primary'>Submit</Button>
            </div>

            {url &&
              <div className="input-item">
                <div className='image-box'>
                  <Image
                    width={512}
                    height={500}
                    priority
                    // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
                    src={url}
                    alt="模型图片"
                  />
                </div>
              </div>
            }
          </div>

        </div>
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