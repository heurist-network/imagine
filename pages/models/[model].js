"use client";
import { useState, useEffect } from "react";
import style from "./index.module.scss";
function Model({ model }) {
  const [data, setData] = useState("data Model");
  useEffect(() => {
    console.log('-- model --', model);
  }, []);
  return (
    <div className={style.root}>
      component
      {data}
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