import { useState, useEffect } from "react";
import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import style from "./index.module.scss";
function ImageBox({ imageJson }) {
  const imageStyle = {
    // borderRadius: '50%',
    border: "1px solid #fff",
    objectFit: "contain",
    width: "100%",
    height: "auto",
  };
  console.log("image component imageJson: ", imageJson);
  useEffect(() => {});
  return (
    <div className={style.root}>
      ImageBox component
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="20px">
          {imageJson.map((item) => (
            <Image
              key={item.name}
              width={200}
              height={400}
              style={imageStyle}
              priority
              // src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/ArthemyComics.png"
              src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.png`}
              alt="模型图片"
            />
          ))}

          {/* <Image width={200} height={400} style={imageStyle} priority src="https://s3.us-east-1.amazonaws.com/heurist-images/job1000.png?x-id=GetObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWOPEZTMXAGL5MRP7%2F20240112%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240112T034939Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=f2428e4d824e4a14055f6b70e4196a6e785f59562394a923e67e7fb5a0fbea8c" alt="模型图片" /> */}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
export default ImageBox;
