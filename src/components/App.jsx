import '../css/App.css'
import { Canvas } from "@react-three/fiber";
import { Mii } from './Mii';


function App() {
  return (
    <Canvas>
      <Mii/>
    </Canvas>
  )
}

export default App