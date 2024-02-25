"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useLocalStorage } from "usehooks-ts";
import { nanoid } from "nanoid";
import { formatDistance } from "date-fns";

import Image from "next/image";
import { Button, Modal, InputNumber, Typography, Image as AImage } from "antd";
import TopNav from "@/components/TopNav";
import { Input } from "antd";
import { Slider } from "antd";
import Confetti from "react-confetti";

import style from "./index.module.scss";

const { Paragraph } = Typography;

function Model({ model, author }) {
  const [modelObj, setModelObj] = useState({});
  const [history, setHistory] = useLocalStorage("IMAGINE_HISTORY", []);
  const [errorMessage, setErrorMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [neg_prompt, setNegPrompt] = useState("");
  const [num_iterations, setNumInterations] = useState(30);
  const [guidance_scale, setGuidanceScale] = useState(10);
  const [seed, setSeed] = useState("-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuprise, setShowSuprise] = useState(false);
  const [preset, setPreset] = useState({});
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(768);
  const [resultImgUrl, setResultImgUrl] = useState("");

  const findModelHistory = (
    history.find((item) => item.model === model)?.lists ?? []
  )
    .sort((a, b) => +new Date(b.create_at) - +new Date(a.create_at))
    .slice(0, 5);

  const getImage = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { data } = await fetch("/api/getImage", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          num_iterations,
          neg_prompt,
          width,
          height,
          model,
          seed,
          neg_prompt,
          guidance_scale,
        }),
      }).then((res) => res.json());
      setLoading(false);
      setResultImgUrl(data);

      const findModel = history.find((item) => item.model === model);

      const url = `https://d1dagtixswu0qn.cloudfront.net/${
        data.split("/").slice(-1)[0].split("?")[0]
      }`;
      const item = {
        id: nanoid(),
        url,
        prompt,
        neg_prompt,
        seed,
        width,
        height,
        num_inference_steps: preset.num_inference_steps,
        guidance_scale,
        create_at: new Date().toISOString(),
      };

      if (!findModel) {
        const obj = { model, lists: [item] };
        setHistory([...history, obj]);
      } else {
        findModel.lists.push(item);
        setHistory(history);
      }

      setTimeout(() => {
        window.scrollTo({
          top: 1000,
          left: 0,
          behavior: "smooth",
        });
        //setShowSuprise(true)
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to generate image, please try again.");
      setLoading(false);
    }
  };

  const getImageInfo = async () => {
    console.log("loading model presets and images");
    setModelObj({});
    const res1 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`
    ).then((res) => res.json());
    const res2 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`
    ).then((res) => res.json());
    const res3 = await fetch(
      `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`
    ).then((res) => res.json());
    const newModelObj = {};
    newModelObj[model] = res1;
    newModelObj[`${model}-2`] = res2;
    newModelObj[`${model}-3`] = res3;
    setModelObj(newModelObj);
  };
  useEffect(() => {
    if (model) {
      getImageInfo();
    }
  }, [model]);

  const showModal = (index) => {
    const modelKey = `${model}${index == 1 ? "" : `-${index}`}`;
    const presetData = { ...modelObj[modelKey] };
    delete presetData["sampler"];
    setPreset(presetData);
    setIsModalOpen(true);
  };

  const handleUsePreset = () => {
    setPrompt(preset.prompt);
    setNumInterations(preset.num_inference_steps);
    setNegPrompt(preset.neg_prompt);
    setGuidanceScale(preset.guidance_scale);
    setWidth(preset.width);
    setHeight(preset.height);
    setSeed(preset.seed);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Head>
        <title>Imagine | AI Image generator by Heurist</title>
      </Head>
      <div className={style.root}>
        <TopNav />
        {showSuprise && (
          <Confetti
            numberOfPieces={3000}
            height={document.body.clientHeight}
            tweenDuration={8000}
            recycle={false}
          />
        )}

        <div className={style.root}>
          <div className="content">
            <div className="model_title_row">
              <span className="model_title">{model}</span>
            </div>
            <div className="model_creator">
              Created by <span>{author}</span>
            </div>
            <Modal
              title="Prompt"
              open={isModalOpen}
              okText="Use this prompt"
              okButtonProps={{ size: "large" }}
              cancelButtonProps={{ size: "large" }}
              onOk={handleUsePreset}
              onCancel={handleCancel}
            >
              <p>{JSON.stringify(preset)}</p>
            </Modal>
            {model && (
              <div className="image-wrap">
                <div className="image-box">
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(1)}>
                    <Image
                      src="/info.png"
                      width={20}
                      height={20}
                      alt="model info"
                    />
                  </div>
                </div>
                <div className="image-box">
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(2)}>
                    <Image
                      src="/info.png"
                      width={20}
                      height={20}
                      alt="sample"
                    />
                  </div>
                </div>

                <div className="image-box">
                  <Image
                    width={512}
                    height={500}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.png`}
                    alt="sample"
                  />
                  <div className="image-notice" onClick={() => showModal(3)}>
                    <Image
                      src="/info.png"
                      width={20}
                      height={20}
                      alt="sample"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="input-form">
              <div className="input-item">
                <h3>Prompt</h3>
                <Input
                  value={prompt}
                  placeholder="Prompt"
                  size="large"
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="input-item">
                <h3>Negative Prompt</h3>
                <Input
                  value={neg_prompt}
                  placeholder="Negative Prompt"
                  size="large"
                  onChange={(e) => setNegPrompt(e.target.value)}
                />
              </div>
              <div className="input-item">
                <h3>Sampling Steps</h3>
                <Slider
                  min={1}
                  max={50}
                  defaultValue={25}
                  value={num_iterations}
                  onChange={(value) => setNumInterations(value)}
                  disabled={false}
                />
              </div>
              <div className="input-item">
                <h3>Guidance Scale</h3>
                <Slider
                  min={1}
                  max={20}
                  step={0.1}
                  defaultValue={7}
                  value={guidance_scale}
                  onChange={(value) => setGuidanceScale(value)}
                  disabled={false}
                />
              </div>
              <div className="input-item">
                <h3>Width</h3>
                <InputNumber
                  min={512}
                  max={1024}
                  defaultValue={512}
                  value={width}
                  onChange={(value) => setWidth(value)}
                />
              </div>
              <div className="input-item">
                <h3>Height</h3>
                <InputNumber
                  min={512}
                  max={1024}
                  defaultValue={768}
                  value={height}
                  onChange={(value) => setHeight(value)}
                />
              </div>
              <div className="input-item">
                <h3>Seed</h3>
                <p>
                  Use -1 for random results. Use non-negative number for
                  deterministic results.
                </p>
                <Input
                  defaultValue={"-1"}
                  value={seed}
                  placeholder="Seed"
                  size="large"
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
              <div className="input-item">
                <Button
                  onClick={getImage}
                  loading={loading}
                  size="large"
                  type="primary"
                >
                  SUBMIT
                </Button>
                {errorMessage && (
                  <p
                    className={style.errorMessage}
                    onClick={() => setErrorMessage("")}
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
              {resultImgUrl && (
                <div className="input-item">
                  <div className="image-box">
                    <Image
                      unoptimized
                      width={width}
                      height={height}
                      priority
                      src={resultImgUrl}
                      alt="image result"
                    />
                  </div>
                  <a href={resultImgUrl} download>
                    Download Original Image
                  </a>
                </div>
              )}
              <div style={{ marginTop: 40 }}>
                <h2>
                  Generate History{" "}
                  <span style={{ fontSize: 14 }}>(Latest 5 items)</span>
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {findModelHistory.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 100, flexShrink: 0 }}>
                        <AImage
                          style={{ width: "100%", height: "auto" }}
                          src={item.url}
                        />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Paragraph
                          copyable
                          ellipsis={{
                            rows: 3,
                            expandable: true,
                            symbol: (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  Modal.info({
                                    title: "Prompt",
                                    content: item.prompt,
                                  });
                                }}
                              >
                                Show more
                              </div>
                            ),
                          }}
                        >
                          {item.prompt}
                        </Paragraph>
                        <div
                          style={{
                            fontSize: 14,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {formatDistance(
                            new Date(item.create_at),
                            new Date(),
                            { addSuffix: true }
                          )}
                          <a href={item.url} download>
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Model;
export function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // false or "blocking"
  };
}
export function getStaticProps({ params }) {
  const { model } = params;
  const modelAndAuthor = model.split("-");
  return {
    props: {
      model: modelAndAuthor[0],
      author: modelAndAuthor[1],
    },
  };
}
