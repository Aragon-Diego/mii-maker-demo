import { GenderButton } from './GenderButton'
import { Banner } from './OptionsBanner'
import { Canvas } from "@react-three/fiber";
import { Mii } from '../Mii';

export const SecondMenu = (props) => {
  return (
    <>
      <Banner/>
      <div className='_3DMii'>
        <Canvas camera={{ position: [0, 0, 20], fov: 25}}>
          <gridHelper position={[0,-3,0]}/>
          <Mii/>
        </Canvas>
      </div>
      <div>

      </div>
    </>
  )
}