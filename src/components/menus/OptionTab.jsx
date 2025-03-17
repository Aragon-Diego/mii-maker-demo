import useSound from 'use-sound';
const clickSound = '/assets/audio/Everything/Sample_0001.wav';
const hoverSound = '/assets/audio/Everything/Sample_0006.wav';
const mouseDownSound = '/assets/audio/Everything/Sample_0002.wav';

export const OptionTab = (props) => {
  const [play, { stop }] = useSound(hoverSound, {volume:0.25});
  const [playClick] = useSound(clickSound, {volume:0.25});
  const [playActive] = useSound(mouseDownSound, {volume:0.25});
  const hairIndexing = props.optionRef == 'hair';
  let nameToCheck = (props.name+1);
  if(hairIndexing) {
    nameToCheck = props.name;
  }
  const checkClick = () => {
    let tempObj = {...props.miiObj};
    tempObj[props.optionRef].index = props.name+1;
    console.log("🚀 ~ checkClick ~ tempObj[props.optionRef].index:", tempObj[props.optionRef].index)
    console.log("🚀 ~ checkClick ~ tempObj:", tempObj)
    props.setMiiObj({...tempObj})
    playClick();
  }
  const getIdexOfFace = () => {
    var n = 0;
    if(!(hairIndexing && nameToCheck == 0)) {
      if((nameToCheck) < 10) {
        n = (''+nameToCheck).padStart(2, "0");
      } else {
        n = (''+nameToCheck);
      }
    }
    return n;
  }
  const getSvg = () => {
    var ref = props.optionRef == 'head' ? 'face' : props.optionRef;
    return ref;
  }
  return (
    <>
      <div onMouseDown={playActive} onClick={checkClick} onMouseEnter={play} onMouseLeave={stop} className={props.miiObj[props.optionRef].index == props.name+1 ? 'Option Option-tab-selected' : 'Option Option-tab'}>
        <svg className='' xmlns="http://www.w3.org/2000/svg">
          <image href={'/assets/images/svg/' + getSvg() + '-' + getIdexOfFace() + '.svg'}/>
        </svg>
      </div>
    </>
  )
}