import '../css/App.css'
import { Canvas } from "@react-three/fiber";
import { Mii } from './Mii';


function App() {
  return (
    <>
      <audio src="./assets/audio/1.mp3" controls autoplay></audio>
    </>
  )
}

/*
{
  <Canvas camera={{ position: [0, 0, 20], fov: 25 }}>
    <Mii/>
  </Canvas>
}
*/
export default App