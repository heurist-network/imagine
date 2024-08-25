import { OrthographicCamera, Preload, View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'

export default function Scene() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return null

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      eventSource={document.body}
    >
      <View.Port />
      <OrthographicCamera makeDefault position={[0, 0, 300]} zoom={1} />
      <Preload all />
    </Canvas>
  )
}
