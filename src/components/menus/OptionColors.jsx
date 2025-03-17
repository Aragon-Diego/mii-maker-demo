import useSound from 'use-sound';
const clickSound = '/mii-maker-demo/assets/audio/Everything/Sample_0001.wav';
const hoverSound = '/mii-maker-demo/assets/audio/Everything/Sample_0006.wav';
const mouseDownSound = '/mii-maker-demo/assets/audio/Everything/Sample_0002.wav';

export const OptionColor = (props) => {
  const [play, { stop }] = useSound(hoverSound, {volume:0.25});
  const [playClick] = useSound(clickSound, {volume:0.25});
  const [playActive] = useSound(mouseDownSound, {volume:0.25});
  let toCheckVsIndex = props?.miiSkinColor;
  if(props.optionRef == 'hair') {
    toCheckVsIndex = props?.hairColor;
  }
  const checkClick = () => {
    if(props.optionRef == 'head') {
      props.setMiiSkinColor(props.index);
    } else if(props.optionRef == 'hair') {
      props.setHairColor(props.index);
    }
    playClick();
  }
 
  return (
    <>
      <div onMouseDown={playActive} onClick={checkClick} onMouseEnter={play} onMouseLeave={stop} className={ toCheckVsIndex == (props.index) ? 'Option-color-selected ' : 'Option-color'} style={{backgroundColor:props.name}}></div>
    </>
  )
}