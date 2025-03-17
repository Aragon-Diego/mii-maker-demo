import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const FaceTab = (props) => {
  const hairArrTotals = new Array(12).fill(0).map((item, i) => i).map((item, i) => {
    return <OptionTab optionRef={'head'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={i} key={i}/>
  });
  const colorArrTotals = props.MiiSkinColorTable.map((item, i) => {
    return <OptionColor optionRef={'head'} miiSkinColor={props.miiSkinColor} setMiiSkinColor={props.setMiiSkinColor} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item.hex} index={i} key={i}/>
  });
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {hairArrTotals}
        </div>
        <div className='TabMenuColors'>
          {colorArrTotals}
        </div>
      </div>
    </>
  )
}