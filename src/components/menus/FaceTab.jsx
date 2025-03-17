import { useState } from 'react';
import {OptionTab} from './OptionTab';
export const FaceTab = (props) => {
  const hairArrTotals = new Array(12).fill(0).map((item, i) => i).map((item, i) => {
    return <OptionTab optionRef={'head'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={i} key={i}/>
  });
  
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {hairArrTotals}
        </div>
        
      </div>
    </>
  )
}