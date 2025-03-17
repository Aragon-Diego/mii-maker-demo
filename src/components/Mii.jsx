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
  const face = useGLTF('/assets/models/faces/face_1.glb');
  const getIndex = (indexToCheck) => {
    var n = 0;
    if((indexToCheck) < 10) {
      n = (''+indexToCheck).padStart(2, "0");
    } else {
      n = (''+indexToCheck);
    }
    return n;
  }
  const getSuperPosition = (arr1, arr2, mirror) => {
    let arr3 = arr1;
    if(arr2[0] != null && arr2[1] != null && arr2[2] != null) {
      arr3[0] = arr1[0] + (mirror ? -1 * arr2[0] : arr2[0]);
      arr3[1] = arr1[1] + arr2[1];
      arr3[2] = arr1[2] + arr2[2];
    }
    return arr3;
  }
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
      <Svg superScale={0} superPosition={getSuperPosition([0,1.45,1.01], props.miiObj.mouth.superPosition)} svg={'mouth-'+ getIndex(props.miiObj.mouth.index)}/>
      <Svg superScale={0} superPosition={getSuperPosition([0.3,2.2,1], props.miiObj.eyes.superPosition)} svg={'eyes-'+ getIndex(props.miiObj.eyes.index)}/>
      <Svg superScale={0} superPosition={getSuperPosition([-0.3,2.2,1], props.miiObj.eyes.superPosition, true)} svg={'eyes-'+ getIndex(props.miiObj.eyes.index)} mirror={true}/>
      <Svg superScale={0} superPosition={getSuperPosition([0.3,2.5,1], props.miiObj.eyebrows.superPosition)} svg={'eyebrows-'+ getIndex(props.miiObj.eyebrows.index)}/>
      <Svg superScale={0} superPosition={getSuperPosition([-0.3,2.5,1], props.miiObj.eyebrows.superPosition, true)} svg={'eyebrows-'+ getIndex(props.miiObj.eyebrows.index)} mirror={true}/>
      <Face index={1}/>
      <Hair index={props.miiObj.hair.index} color={props.miiObj.hair.color} material={face.nodes.shape.material}/>
      {props.miiObj.gender == 'male' ? (<MiiBodyM/>) : (<MiiBodyF/>)}
    </>
  )
}