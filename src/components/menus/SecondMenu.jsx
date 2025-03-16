import { useState } from 'react';
import { GenderButton } from './GenderButton'
import { Banner } from './OptionsBanner'
import { Canvas } from "@react-three/fiber";
import { Mii } from '../Mii';
export const SecondMenu = (props) => {
  const [miiObj, setMiiObj] = useState({
    head:1,
    nose:1,
    hair:15,
    gender:props.gender
  })
  const [activeTab, setActiveTab] = useState(3);
  const getTabMenu = () => {
    if(activeTab == 1) {
      return ""
    }
  }
  return (
    <>
      <Banner activeTab ={activeTab} miiObj={miiObj} setMiiObj={setMiiObj} setActiveTab={setActiveTab}/>
      <div className='_3DMii'>
        <Canvas camera={{ position: [0, 0, 20], fov: 25}}>
          <gridHelper position={[0,-3,0]}/>
          <Mii setMiiObj={setMiiObj} miiObj={miiObj}/>
        </Canvas>
      </div>
      <div className='TabMenu'>

      </div>
    </>
  )
}