import { useState } from 'react';
import { GenderButton } from './GenderButton'
import { Banner } from './OptionsBanner'
import { Canvas } from "@react-three/fiber";
import { Mii } from '../Mii';
import {FaceTab} from './FaceTab'
import {HairTab} from './HairTab'
import {NoseTab} from './NoseTab'
export const SecondMenu = (props) => {
  const [miiObj, setMiiObj] = useState({
    head: {index:1, color:{r:0.8, g:0.4, b:0.2}},
    nose: {index:1, color:{r:0.69, g:0.3, b:0.33}},
    hair: {index:1, color:{r:0.5, g:0.5, b:0.5}},
    gender:props.gender
  });
  const [miiSkinColor, setMiiSkinColor] = useState(1);
  const [hairColor, setHairColor] = useState(0);
  const [activeTab, setActiveTab] = useState(3);
  // aregar cambiar color de skin por el miiSkinColor[0]
  const ChangeSkinColor = () => {
    miiObj.head.color = props.MiiSkinColorTable[miiSkinColor].color;
    miiObj.nose.color = props.MiiSkinColorTable[miiSkinColor].color;
  }
  ChangeSkinColor();
  const ChangeHairColor = () => {
    miiObj.hair.color = props.HairColorTable[hairColor].color;
  }
  ChangeHairColor();
  console.log("🚀 ~ ChangeHairColor ~ miiObj:", miiObj)
  const getTabMenu = () => {
    if(activeTab == 3) {
      return <FaceTab MiiSkinColorTable={props.MiiSkinColorTable} setMiiSkinColor={setMiiSkinColor} miiSkinColor={miiSkinColor} setMiiObj={setMiiObj} miiObj={miiObj}/>
    } else if(activeTab == 4) {
      return <HairTab HairColorTable={props.HairColorTable} setHairColor={setHairColor} hairColor={hairColor} setMiiObj={setMiiObj} miiObj={miiObj}/>
    } else if(activeTab == 7) {
      return <NoseTab HairColorTable={props.HairColorTable} setHairColor={setHairColor} hairColor={hairColor} setMiiObj={setMiiObj} miiObj={miiObj}/>
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