import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const images = [
  "https://picsum.photos/200/300?image=1050",
  //...
  "https://picsum.photos/300/300?image=206",
]

class MyWrapper extends React.Component {
  render() {
    return (
      <ResponsiveMasonry>

        <Masonry columnsCount={3} gutter="10px">
          {images.map((image, i) => (
            <img
              key={i}
              src={image}
              style={{ width: "100%", display: "block" }}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    )
  }
}
export default MyWrapper