import useSound from 'use-sound';
const clickSound = '/mii-maker-demo/assets/audio/Everything/Sample_0001.wav';
const hoverSound = '/mii-maker-demo/assets/audio/Everything/Sample_0006.wav';
const mouseDownSound = '/mii-maker-demo/assets/audio/Everything/Sample_0002.wav';

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
        <img src={'/mii-maker-demo/assets/images/menu/' + props.name + '.png'} unselectable="on"/>
      </div>
    </>
  )
}