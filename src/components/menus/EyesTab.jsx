import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const EyesTab = (props) => {
  const filterIndex = [9, 22, 24, 26, 36, 42, 47, 59];
  let index = 0;
  let EyesArrTotals = new Array(60).fill(0).reduce((acum, item) => {
    if(filterIndex.includes(index)) {
      index += 1;
      return acum;
    }
    acum.push(index);
    index += 1;
    return acum;
  }, []);
  EyesArrTotals = EyesArrTotals.map((item, i) => {
    return <OptionTab optionRef={'eyes'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item} key={item}/>
  });
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {EyesArrTotals}
        </div>
      </div>
    </>
  )
}