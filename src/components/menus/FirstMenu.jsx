import { GenderButton } from './GenderButton'
import { Banner } from './Banner'

export const FirstMenu = (props) => {
  return (
    <>
      <Banner/>
      <div className='genderWrapper'>
        <GenderButton setMenu={props.setMenu} setGender={props.setGender} gender={'male'}/>
        <GenderButton setMenu={props.setMenu} setGender={props.setGender} gender={'female'}/>
      </div>
    </>
  )
}