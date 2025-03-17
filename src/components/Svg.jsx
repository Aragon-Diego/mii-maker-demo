import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export const Svg = (props) => {
  const svgPath =  "/mii-maker-demo/assets/images/svg/" + (props.svg ? props.svg + '.svg' : 'nose-01.svg');
  const svgData = useLoader(SVGLoader, svgPath);
  const shapes = svgData.paths.flatMap((path) => path.toShapes(false));
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 1,
  });
  geometry.center();
  const scale = new THREE.Vector3(props.mirror ? -0.01 : 0.01, -0.01, 0.01);
  return (
    <mesh geometry={geometry} position={props.superPosition} scale={scale}>
      <meshPhongMaterial attach="material" color="black" />
    </mesh>
  );
};
