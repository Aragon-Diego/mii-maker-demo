/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/assets/models/bodyF.glb 
*/

import React, {useEffect} from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function MiiBodyF(props) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/assets/models/bodyF.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)
  materials['mt_body.001'].color.g = 0;
  materials['mt_body.001'].color.r = 1;
  materials['mt_body.001'].color.b = 0;
  useEffect(()=>{
    actions[names[1]].reset().play();
  }, [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="f" rotation={[Math.PI / 2, 0, 0]} scale={0.05} position={[0,-3,0]}>
          <primitive object={nodes.TopL} />
          <skinnedMesh name="body_f" geometry={nodes.body_f.geometry} material={materials['mt_body.001']} skeleton={nodes.body_f.skeleton} />
          <skinnedMesh name="legs_f" geometry={nodes.legs_f.geometry} material={materials.mt_pants} skeleton={nodes.legs_f.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/bodyF.glb')

