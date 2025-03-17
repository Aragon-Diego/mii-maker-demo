import { Option } from './OptionBanner'

export const Banner = (props) => {
  
  const bannerOptions = [{name:1, text:'Go Back'}, {name:3}, {name:4}, {name:5}, {name:6}, {name:7}, {name:8}];
  return (
    <>
      <div className="OptionsBanner">
        {bannerOptions.map((item, i) => <Option miiObj={props.miiObj} setMiiObj={props.setMiiObj} activeTab={props.activeTab} setActiveTab={props.setActiveTab} name={item.name} text={item?.text} key={i}/>)}
      </div>
    </>
  )
}