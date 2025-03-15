import { OrbitControls } from "@react-three/drei"

export const Mii = () => {
  return (
    <>
      <OrbitControls/>
      <mesh>
        <boxGeometry/>
        <meshNormalMaterial/>
      </mesh>
    </>
  )
}