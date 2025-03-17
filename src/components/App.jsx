import { useState } from 'react';
import '../css/App.css'
import { Audio } from './menus/Audio';
import { FirstMenu } from './menus/FirstMenu'
import { SecondMenu } from './menus/SecondMenu'
const MiiSkinColorTable = [
  {hex:'#E3C4A2', color:{r:0.8, g:0.4, b:0.2}},
  {hex:'#E0BA7E', color:{r:0.7, g:0.33, b:0.1}},
  {hex:'#DE9F85', color:{r:0.9, g:0.3, b:0.2}},
  {hex:'#D99283', color:{r:0.8, g:0.25, b:0.2}},
  {hex:'#BC563C', color:{r:0.5, g:0.1, b:0.05}},
  {hex:'#774236', color:{r:0.2, g:0.07, b:0.05}},
  {hex:'#CE9BA0', color:{r:0.69, g:0.3, b:0.33}},
  {hex:'#955353', color:{r:0.3, g:0.1, b:0.1}},
  {hex:'#301516', color:{r:0.05, g:0.01, b:0.01}},
];
const HairColorTable = [
  {hex:'#000000', color:{r:0.0, g:0.0, b:0.0}},
  {hex:'#1B0B0B', color:{r:0.03, g:0.01, b:0.01}},
  {hex:'#3D0904', color:{r:0.09, g:0.01, b:0.001}},
  {hex:'#451606', color:{r:0.1, g:0.02, b:0.001}},
  {hex:'#929292', color:{r:0.3, g:0.3, b:0.3}},
  {hex:'#3F241D', color:{r:0.09, g:0.04, b:0.03}},
  {hex:'#48260F', color:{r:0.1, g:0.04, b:0.01}},
  {hex:'#786A40', color:{r:0.2, g:0.16, b:0.07}},
];

function App() {
  const [gender, setGender] = useState('');
  const [menuState, setMenu] = useState(1);
  const getMenu = () => {
    if(menuState == 1) {
      return <FirstMenu setMenu={setMenu} setGender={setGender}/>
    } else if(menuState == 2) {
      return <SecondMenu HairColorTable={HairColorTable} MiiSkinColorTable={MiiSkinColorTable} setMenu={setMenu} setGender={setGender} gender={gender}/>
    } else {
      return <FirstMenu setMenu={setMenu} setGender={setGender}/>
    }
  }
  let menu = getMenu();

  return (
    <>
      {/* aqui hay que poner un banner explicando la página */}
      {menu}
      <Audio/>
    </>
  )
}

/*
{
  
}
*/
export default App