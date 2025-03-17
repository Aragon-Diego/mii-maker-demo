import { OrbitControls } from "@react-three/drei"
import { MiiBodyM } from "./MiiBodyM"
import { MiiBodyF } from "./MiiBodyF"
import { useGLTF } from '@react-three/drei'
import { Head } from "./Head";
import { Nose } from "./Nose";
import { Hair } from "./Hair";
import { Face } from "./Face";
import {Svg} from './Svg'


export const Mii = (props) => {
  const face = useGLTF('./assets/models/faces/face_1.glb');
  return (
    <>
      <OrbitControls/>
      <directionalLight
        position={[-0.01, 1, 1]}
        intensity={5}
      />
      <directionalLight
        position={[0.01, -1, -1]}
        intensity={3}
      />
      <directionalLight
        position={[5, 0, 0]}
        intensity={3}
      />
      <directionalLight
        position={[-5, 0, 0]}
        intensity={3}
      />
      {/**/}
      <Head index={props.miiObj.head.index} color={props.miiObj.head.color}/>
      <Nose superScale={0} index={props.miiObj.nose.index} color={props.miiObj.nose.color}/>
      <Svg superScale={0} superPosition={[0,1.45,0.9]} svg={'mouth-20'}/>
      <Svg superScale={0} superPosition={[0.3,2.2,1]} svg={'eyes-02'}/>
      <Svg superScale={0} superPosition={[-0.3,2.2,1]} svg={'eyes-02'} mirror={true}/>
      <Svg superScale={0} superPosition={[0.3,2.5,1]} svg={'eyebrows-01'}/>
      <Svg superScale={0} superPosition={[-0.3,2.5,1]} svg={'eyebrows-01'} mirror={true}/>
      <Face index={1}/>
      <Hair index={props.miiObj.hair.index} color={props.miiObj.hair.color} material={face.nodes.shape.material}/>
      {props.miiObj.gender == 'male' ? (<MiiBodyM/>) : (<MiiBodyF/>)}
    </>
  )
}