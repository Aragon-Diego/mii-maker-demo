import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const EyebrowsTab = (props) => {
  const filterIndex = [2, 10];
  let index = 0;
  let EyebrowsArrTotals = new Array(24).fill(0).reduce((acum, item) => {
    if(filterIndex.includes(index)) {
      index += 1;
      return acum;
    }
    acum.push(index);
    index += 1;
    return acum;
  }, []);
  EyebrowsArrTotals = EyebrowsArrTotals.map((item, i) => {
    return <OptionTab optionRef={'eyebrows'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item} key={item}/>
  });
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {EyebrowsArrTotals}
        </div>
      </div>
    </>
  )
}