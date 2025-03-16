import '../css/App.css'
import { Canvas } from "@react-three/fiber";
import { Mii } from './Mii';
import { Audio } from './menus/Audio';
import { FirstMenu } from './menus/FirstMenu'

function App() {
  return (
    <>
      <FirstMenu/>
      <Audio/>
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