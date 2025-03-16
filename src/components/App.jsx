import { useState } from 'react';
import '../css/App.css'
import { Audio } from './menus/Audio';
import { FirstMenu } from './menus/FirstMenu'
import { SecondMenu } from './menus/SecondMenu'


function App() {
  const [gender, setGender] = useState('');
  const [menuState, setMenu] = useState(1);

  const getMenu = () => {
    if(menuState == 1) {
      return <FirstMenu setMenu={setMenu} setGender={setGender}/>
    } else if(menuState == 2) {
      return <SecondMenu setMenu={setMenu} setGender={setGender} gender={gender}/>
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