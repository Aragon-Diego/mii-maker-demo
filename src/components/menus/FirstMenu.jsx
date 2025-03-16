import { GenderButton } from './GenderButton'
import { Banner } from './Banner'

export const FirstMenu = (props) => {
  return (
    <>
      <Banner/>
      <div className='genderWrapper'>
        <GenderButton  gender={'male'}/>
        <GenderButton  gender={'female'}/>
      </div>
    </>
  )
}