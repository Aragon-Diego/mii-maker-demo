import '../css/App.css'
import { Canvas } from "@react-three/fiber";
import { Mii } from './Mii';


function App() {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 25 }}>
      <Mii/>
    </Canvas>
  )
}

export default App