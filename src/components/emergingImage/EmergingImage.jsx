import { useGSAP } from '@gsap/react'
import { View } from '@react-three/drei'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import * as THREE from 'three'

import EmergeMaterial from './EmergeMaterial'
import useScreenSize from './useScreenSize'

const PIXELS = [
  1, 1.5, 2, 2.5, 3, 1, 1.5, 2, 2.5, 3, 3.5, 4, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
  6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 20, 100,
].map((v) => v / 100)

export default function EmergingImage({ ...props }) {
  const [refMesh, setRefMesh] = useState(null)
  const [texture, setTexture] = useState(null)
  const [textureSize, setTextureSize] = useState([0, 0])
  const [elementSize, setElementSize] = useState([0, 0])
  const ref = useRef()
  const screenSize = useScreenSize()
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()

    textureLoader
      .loadAsync(props.url)
      .then((data) => {
        setTextureSize([data.source.data.width, data.source.data.height])
        setTexture(data)
      })
      .catch(() => {
        setLoadError(true)
      })
  }, [])

  useEffect(() => {
    if (refMesh) {
      refMesh.material.uProgress = 0
      refMesh.material.uType = props.type
    }
  }, [props.type])

  useGSAP(() => {
    if (refMesh?.material) {
      gsap.to(refMesh.material, {
        uProgress: isIntersecting ? 1 : 0,
        duration: 1.5,
        ease: 'none',
      })
    }
  }, [isIntersecting, props.type])

  // scroll check
  // only set intersecting if refMesh is available, important
  // Thanks Cody Bennett for this issue!
  useLayoutEffect(() => {
    if (refMesh) {
      let bounds = ref.current.getBoundingClientRect()
      setElementSize([bounds.width, bounds.height])
      refMesh?.scale.set(bounds.width, bounds.height, 1)
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      })
      observer.observe(ref.current)
    }
  }, [refMesh])

  // resize
  useEffect(() => {
    if (loadError || !ref.current) return
    let bounds = ref.current.getBoundingClientRect()
    setElementSize([bounds.width, bounds.height])
    refMesh?.scale.set(bounds.width, bounds.height, 1)
  }, [screenSize, loadError])

  if (loadError) {
    return (
      <div className="relative flex-1">
        <Image
          className="flex-1"
          src={props.url}
          unoptimized
          priority
          objectFit="cover"
          layout="fill"
          alt="image"
        />
      </div>
    )
  }

  return (
    <View {...props} ref={ref}>
      <mesh ref={setRefMesh}>
        <emergeMaterial
          transparent={true}
          uTexture={texture}
          uPixels={PIXELS}
          uFillColor={new THREE.Color('#403fb7')}
          uTextureSize={new THREE.Vector2(textureSize[0], textureSize[1])}
          uElementSize={new THREE.Vector2(elementSize[0], elementSize[1])}
        />
        <planeGeometry args={[1, 1]} />
      </mesh>
    </View>
  )
}
