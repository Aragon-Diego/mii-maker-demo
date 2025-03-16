import { Option } from './OptionBanner'

export const Banner = (props) => {
  
  const bannerOptions = [{name:1}, {name:2}, {name:3}, {name:4}, {name:5}, {name:6}, {name:7}, {name:8}];
  console.log("🚀 ~ Banner ~ bannerOptions:", bannerOptions)
  return (
    <>
      <div className="OptionsBanner">
        {bannerOptions.map((item, i) => <Option activeTab={props.activeTab} setActiveTab={props.setActiveTab} name={item.name} key={i}/>)}
      </div>
    </>
  )
}