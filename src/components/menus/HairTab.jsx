import { useState } from 'react';
import {OptionTab} from './OptionTab';
import {OptionColor} from './OptionColors';
export const HairTab = (props) => {
  const filterIndex = [23, 30, 34, 41, 57, 59, 65, 80, 88, 89];
  let index = 0;
  let hairArrTotals = new Array(131).fill(0).reduce((acum, item) => {
    if(filterIndex.includes(index)) {
      index += 1;
      return acum;
    }
    acum.push(index);
    index += 1;
    return acum;
  }, []);
  console.log("🚀 ~ hairArrTotals ~ hairArrTotals:", hairArrTotals)
  hairArrTotals = hairArrTotals.map((item, i) => {
    return <OptionTab optionRef={'hair'} miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item} key={item}/>
  });
  console.log("🚀 ~ hairArrTotals=hairArrTotals.map ~ hairArrTotals:", hairArrTotals)
  const colorArrTotals = props.HairColorTable.map((item, i) => {
    return <OptionColor optionRef={'hair'} HairColorTable={props.HairColorTable} setHairColor={props.setHairColor} hairColor={props.hairColor}  miiObj={props.miiObj} setMiiObj={props.setMiiObj} name={item.hex} index={i} key={i}/>
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