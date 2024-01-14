"use client";
import { useState, useEffect } from "react";
import Head from 'next/head';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { Button, Modal } from 'antd';
import TopNav from '@/components/TopNav'
import { Input } from 'antd';
import { Slider } from 'antd';
import { useClipboard } from '@/lib/tool'
import style from "./index.module.scss";
const modelObj = {}

function Model({ model, author }) {
  const [data, setData] = useState("data Model");
  const [prompt, setPrompt] = useState("")
  const [neg_prompt, setNegPrompt] = useState("")
  const [num_iterations, setNumInterations] = useState(30)
  const [seed, setSeed] = useState(-1)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState({})
  const [width, setWidth] = useState(750)
  const [height, setHeight] = useState(750)
  console.log('modelObj', modelObj);
  const [url, setUrl] = useState("")
  const getImage = async () => {
    setLoading(true)
    const { data } = await fetch('/api/getImage', {
      method: 'POST', body: JSON.stringify({ prompt: 'girl', num_iterations, neg_prompt, width, height, model, neg_prompt })
    }).then(res => res.json());
    console.log('--res data--', data);
    setLoading(false)
    setUrl(data)
  }

  const valueChange = (e) => {
    console.log('设置value', e.target.value);
    setPrompt(e.target.value)
  }
  const getImageInfo = async () => {
    const res1 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`).then(res => res.json());
    const res2 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`).then(res => res.json());
    const res3 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`).then(res => res.json());
    modelObj[model] = res1
    console.log('执行设置', res1);
    modelObj[`${model}-2`] = res2
    modelObj[`${model}-3`] = res3
  }
  useEffect(() => {
    if (model) {
      modelObj[model] = {}
      modelObj[`${model}-2`] = {}
      modelObj[`${model}-3`] = {}
      getImageInfo()
    }
  }, [model]);
  const showModal = async (value) => {
    switch (value) {
      case model:
        console.log('info: ', model);
        console.log('info -- : ', modelObj);
        setShowInfo(modelObj[model])
        break;
      case `${model}-2`:
        console.log('info: ', model);
        console.log('info -- : ', modelObj);
        setShowInfo(modelObj[`${model}-2`])
        break;
      case `${model}-3`:
        console.log('info: ', model);
        console.log('info -- : ', modelObj);
        setShowInfo(modelObj[`${model}-3`])
        break;

      default:
        break;
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log('--showInfo----', showInfo);
    // useClipboard(showInfo.prompt)
    setPrompt(showInfo.prompt)
    setNumInterations(showInfo.num_inference_steps)
    setNegPrompt(showInfo.neg_prompt)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Head>
        <title>Heurist FREE Image generate</title>
      </Head>
      <div className={style.root}>
        <TopNav />
        <div className={style.root}>
          <div className="content">
            <div className="model_title_row">
              <span className="model_title">{model}</span>
            </div>
            <div className="model_creator">
              {/* TODO: use "author" field from https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json */}
              Created by <span>{author}</span>
            </div>
            <Modal title="Prompt" open={isModalOpen} okText="Use this prompt" okButtonProps={{ size: 'large' }} cancelButtonProps={{ size: 'large' }} onOk={handleOk} onCancel={handleCancel}>
              <p>{JSON.stringify(showInfo)}</p>
            </Modal>
            {model &&
              <div className="image-wrap">
                <div className='image-box'>
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(model)}>
                    <Image src='/info.png' width={20} height={20} alt="model info" />
                  </div>
                </div>
                <div className='image-box'>
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(`${model}-2`)}>
                    <Image src='/info.png' width={20} height={20} alt="sample" />
                  </div>
                </div>

                <div className='image-box'>
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(`${model}-2`)}>
                    <Image src='/info.png' width={20} height={20} alt="sample" />
                  </div>
                </div>
              </div>
            }

            <div className="input-form">
              <div className="input-item">
                <h3>Prompt</h3>
                <Input value={prompt} placeholder="Prompt" size='large' onChange={(e) => setPrompt(e.target.value)} />
              </div>
              <div className="input-item">
                <h3>Sampling Steps</h3>
                <Slider
                  min={1}
                  max={50}
                  defaultValue={25}
                  value={num_iterations}
                  onChange={value => setNumInterations(value)}
                  disabled={false}
                />
              </div>
              <div className="input-item">
                <h3>Width</h3>
                <Slider
                  min={512}
                  max={1024}
                  defaultValue={512}
                  value={width}
                  onChange={value => setWidth(value)}
                  disabled={false}
                />
              </div>
              <div className="input-item">
                <h3>Height</h3>
                <Slider
                  min={512}
                  max={1024}
                  defaultValue={512}
                  value={height}
                  onChange={value => setHeight(value)}
                  disabled={false}
                />
              </div>

              {/* TODO: set width and height with slider. Range: 512 ~ 1024*/}
              <div className="input-item">
                <h3>Seed</h3>
                <Input value={seed} placeholder="Seed" size='large' onChange={(e) => setSeed(e.target.value)} />
              </div>
              <div className="input-item">
                <h3>Negative Prompt</h3>
                <Input value={neg_prompt} placeholder="Negative Prompt" size='large' onChange={(e) => setNegPrompt(e.target.value)} />
              </div>
              <div className="input-item">
                <Button onClick={getImage} loading={loading} size='large' type='primary'>SUBMIT</Button>
              </div>

              {url &&
                <div className="input-item">
                  <div className='image-box'>
                    <Image
                      width={512}
                      height={500}
                      priority
                      src={url}
                      alt="sample1"
                    />
                  </div>
                </div>
              }
            </div>

          </div>
        </div>
      </div>
    </>

  )
}
export default Model
export function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          model: '',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}
export function getStaticProps({ params }) {
  const { model } = params;
  const modelAndAuthor = model.split('-')
  console.log('model--', model);
  return {
    props: {
      model: modelAndAuthor[0],
      author: modelAndAuthor[1]
    }
  }
}