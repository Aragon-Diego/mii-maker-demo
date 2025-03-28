/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 publicmii-maker-demo/assets/models/hairs/hair_1.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'
let pathToPreLoad = '/mii-maker-demo/assets/models/hairs/hair_1.glb';
import * as THREE from 'three'

export function Hair(props) {
  pathToPreLoad = '/mii-maker-demo/assets/models/hairs/hair_' + props.index + '.glb';
  const { nodes, materials } = useGLTF(pathToPreLoad);
  let material = props.material;
  material.metalness = 0.5;
  material.roughness = 0.5;
  material.color = {... material.color, ...props.color};
  return (
    <group {...props} dispose={null} scale={0.04} position={[0, 0.79, 0.15]}>
      <mesh geometry={nodes.shape.geometry} material={material}/>
    </group>
  )
}

useGLTF.preload(pathToPreLoad)
