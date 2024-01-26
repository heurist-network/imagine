import { useState, useEffect } from "react";
import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import style from "./index.module.scss";
import Link from "next/link";
function ImageBox({ imageJson }) {
  useEffect(() => {});
  return (
    <div className={style.root}>
      <h2>Models Deployed</h2>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 640: 2, 940: 3, 1240: 4 }}
      >
        <Masonry gutter="20px">
          {imageJson.map((item) => (
            <Link
              href={`/models/${item.name}-${item.author}`}
              key={item.name}
              className="image-item"
            >
              <Image
                width={280}
                height={400}
                priority
                src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.png`}
                alt="models image"
              />
              <div className="name-box">{item.name}</div>
            </Link>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
export default ImageBox;
