"use client";
import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { Button, Modal } from 'antd';
import TopNav from '@/components/TopNav'
import { Input } from 'antd';
import { Slider } from 'antd';
import { useClipboard } from '@/lib/tool'
import style from "./index.module.scss";
const modelObj = {}

function Model({ model }) {
  const [data, setData] = useState("data Model");
  const [value, setValue] = useState("")
  const [num_iterations, setNumInterations] = useState(30)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState({})
  console.log('modelObj', modelObj);
  const [url, setUrl] = useState("")
  const getImage = async () => {
    setLoading(true)
    const { data } = await fetch('/api/getImage', {
      method: 'POST', body: JSON.stringify({ prompt: 'girl', num_iterations })
    }).then(res => res.json());
    console.log('--res data--', data);
    setLoading(false)
    setUrl(data)
  }

  const valueChange = (e) => {
    console.log('设置value', e.target.value);
    setValue(e.target.value)
  }
  const getImageInfo = async () => {
    const res1 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`).then(res => res.json());
    // const res2 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`)
    // const res3 = await fetch(`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`)
    modelObj[model] = res1
    console.log('执行设置');
    // modelObj[`${model}-2`] = res2
    // modelObj[`${model}-3`] = res3
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

      default:
        break;
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log('--showInfo----', showInfo);
    // useClipboard(showInfo.prompt)
    setValue(showInfo.prompt)
    setNumInterations(showInfo.num_inference_steps)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
                  // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
                  alt="模型图片"
                />
                <div className="image-notice" onClick={() => showModal(model)}>
                  <Image src='/info.png' width={20} height={20} alt="model info" />
                </div>
              </div>
              {/* <div className='image-box'>
                <Image
                  width={512}
                  height={500}
                  priority
                  // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
                  alt="模型图片"
                />
                <div className="image-notice" onClick={() => showModal(`${model}-2`)}>
                  <Image src='/info.png' width={20} height={20} alt="模型图片" />
                </div>
              </div> */}
            </div>
          }

          <div className="input-form">
            <div className="input-item">
              <h3>Prompt</h3>
              <Input value={value} placeholder="Prompt" size='large' onChange={valueChange} />
            </div>
            <div className="input-item">
              <h3>Sampling Steps</h3>
              <Slider
                min={1}
                max={50}
                defaultValue={30}
                // tooltip={{
                //   open: false,
                // }}
                value={num_iterations}
                onChange={value => setNumInterations(value)}
                disabled={false}
              />
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
                    alt="模型图片1"
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