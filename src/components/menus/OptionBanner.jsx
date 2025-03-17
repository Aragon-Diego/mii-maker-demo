import useSound from 'use-sound';
const clickSound = '/assets/audio/Everything/Sample_0001.wav';
const hoverSound = '/assets/audio/Everything/Sample_0006.wav';
const mouseDownSound = '/assets/audio/Everything/Sample_0002.wav';

export const Option = (props) => {
  const [play, { stop }] = useSound(hoverSound, {volume:0.25});
  const [playClick] = useSound(clickSound, {volume:0.25});
  const [playActive] = useSound(mouseDownSound, {volume:0.25});
  const checkClick = () => {
    props.setActiveTab(props.name)
    playClick();
  }
  return (
    <>
      <div onMouseDown={playActive} onClick={checkClick} onMouseEnter={play} onMouseLeave={stop} className={props.activeTab == props.name ? 'Option-selected' : 'Option'}>
        {props.text == null ? (<img src={'/assets/images/menu/' + props.name + '.png'} unselectable="on"/>) : (<h1 style={{marginTop:'20%'}}>{props.text}</h1>)}
      </div>
    </>
  )
}