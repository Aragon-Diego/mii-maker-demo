import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const MouthTab = (props) => {
  const filterIndex = [3, 8, 9, 12, 16, 18, 21, 23, 33, 35];
  let index = 0;
  let MouthArrTotals = new Array(36).fill(0).reduce((acum, item) => {
    if(filterIndex.includes(index)) {
      index += 1;
      return acum;
    }
    acum.push(index);
    index += 1;
    return acum;
  }, []);
  MouthArrTotals = MouthArrTotals.map((item, i) => {
    return <OptionTab optionRef={'mouth'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item} key={item}/>
  });
  return (
    <>
      <div className='TabMenu'>
        <div className='TabMenuOptions'>
          {MouthArrTotals}
        </div>
      </div>
    </>
  )
}