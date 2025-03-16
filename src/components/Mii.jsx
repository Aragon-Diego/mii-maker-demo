import { OrbitControls } from "@react-three/drei"
import { MiiBodyM } from "./MiiBodyM"
import { MiiBodyF } from "./MiiBodyF"
import { useGLTF } from '@react-three/drei'
import { Head } from "./Head";
import { Nose } from "./Nose";
import { Hair } from "./Hair";
import { Face } from "./Face";


const MiiSkinColorTable = [
  {hex:"#FFD3AD"},
  {hex:"#FEB66B"},
  {hex:"#DE7942"},
  {hex:"#FFAA8C"},
  {hex:"#AD5129"},
  {hex:"#632C18"},
  {hex:"#ffbea5"},
  {hex:"#ffc58f"},
  {hex:"#8c3c23"},
  {hex:"#3c2d23"},
];


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
      <Head index={props.miiObj.head}/>
      <Nose index={props.miiObj.nose}/>
      <Face index={1}/>
      <Hair index={props.miiObj.hair} material={face.nodes.shape.material}/>
      {props.miiObj.gender == 'male' ? (<MiiBodyM/>) : (<MiiBodyF/>)}
    </>
  )
}