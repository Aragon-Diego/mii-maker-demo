import { useState } from 'react';
import { GenderButton } from './GenderButton'
import { Banner } from './OptionsBanner'
import { Canvas } from "@react-three/fiber";
import { Mii } from '../Mii';
import {FaceTab} from './FaceTab'
export const SecondMenu = (props) => {
  const [miiObj, setMiiObj] = useState({
    head: {index:1, color:{r:0.7, g:0.7, b:0.7}},
    nose: {index:1, color:{r:0.7, g:0.7, b:0.7}},
    hair: {index:15, color:{r:0.5, g:0.5, b:0.5}},
    gender:props.gender
  })
  const [activeTab, setActiveTab] = useState(3);
  const getTabMenu = () => {
    if(activeTab == 3) {
      return <FaceTab setMiiObj={setMiiObj} miiObj={miiObj}/>
    } else {
      return ''
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
      {getTabMenu()}
    </>
  )
}