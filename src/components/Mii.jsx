import { OrbitControls } from "@react-three/drei"
import { MiiBodyM } from "./MiiBodyM"
import { Head } from "./Head"

export const Mii = () => {
  return (
    <>
      <OrbitControls/>
      <ambientLight intensity={1} color={'#FFF'}/>
      <directionalLight
        position={[-0.01, 1, 1]}
        intensity={6}
      />
      <directionalLight
        position={[0.01, -1, -1]}
        intensity={2}
      />
      <directionalLight
        position={[5, 0, 0]}
        intensity={2}
      />
      <directionalLight
        position={[-5, 0, 0]}
        intensity={2}
      />
      <Head index={2}/>
      <MiiBodyM/>
    </>
  )
}