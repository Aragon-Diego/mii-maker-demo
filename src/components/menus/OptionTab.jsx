import useSound from 'use-sound';
const clickSound = '/assets/audio/Everything/Sample_0001.wav';
const hoverSound = '/assets/audio/Everything/Sample_0006.wav';
const mouseDownSound = '/assets/audio/Everything/Sample_0002.wav';

export const OptionTab = (props) => {
  const [play, { stop }] = useSound(hoverSound, {volume:0.25});
  const [playClick] = useSound(clickSound, {volume:0.25});
  const [playActive] = useSound(mouseDownSound, {volume:0.25});
  const checkClick = () => {
    let tempObj = {...props.miiObj};
    tempObj[props.optionRef].index = props.name+1;
    console.log("🚀 ~ checkClick ~ tempObj:", tempObj)
    props.setMiiObj({...tempObj})
    playClick();
  }
  const getIdexOfFace = () => {
    var n = 0;
    if((props.name + 1) < 10) {
      n = (''+(props.name+1)).padStart(2, "0");
    } else {
      n = (''+(props.name+1));
    }
    return n;
  }
  const getSvg = () => {
    var ref = props.optionRef == 'head' ? 'face' : props.optionRef;
    return ref;
  }
  return (
    <>
      <div onMouseDown={playActive} onClick={checkClick} onMouseEnter={play} onMouseLeave={stop} className={props.miiObj.head == (props.name+1) ? 'Option Option-tab-selected' : 'Option Option-tab'}>
        <svg className='' xmlns="http://www.w3.org/2000/svg">
          <image href={'/assets/images/svg/' + getSvg() + '-' + getIdexOfFace() + '.svg'}/>
        </svg>
      </div>
    </>
  )
}