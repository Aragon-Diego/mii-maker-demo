/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/assets/models/faces/face_1.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'
let pathToPreLoad = '/mii-maker-demo/assets/models/faces/face_1.glb';


export function Face(props) {
  pathToPreLoad = '/mii-maker-demo/assets/models/faces/face_' + props.index + '.glb';
  const { nodes, materials } = useGLTF(pathToPreLoad)
  nodes.shape.material.metalness = 0.5;
  nodes.shape.material.roughness = 0.5;

  return (
    <group {...props} dispose={null} scale={0} position={[0, 1.6, 0.8]}>
      <mesh geometry={nodes.shape.geometry} material={nodes.shape.material} />
    </group>
  )
}

useGLTF.preload(pathToPreLoad)