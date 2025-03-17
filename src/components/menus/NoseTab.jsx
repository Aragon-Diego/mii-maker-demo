import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const NoseTab = (props) => {
  const noseArrTotals = new Array(16).fill(0).map((item, i) => i).map((item, i) => {
    return <OptionTab color={'black'} optionRef={'nose'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={i} key={i}/>
  });
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {noseArrTotals}
        </div>
      </div>
    </>
  )
}