import React from 'react'
import Block1 from './Block1'
import Block2 from './Block2'
import Block3 from './Block3'
import Block4 from './Block4'
import Block5 from './Block5'

const Homepage = () => {
  
  return (
    <div className='min-h-screen'>
        <div>
            <Block1/>
            
        </div>
        <div>
            
            <Block2/>
            
        </div>

      <div>
      <Block3/>
      </div>
      <div>
      <Block4/>
      </div>
      <div>
      <Block5/>
      </div>
            
      
    </div>
  )
}

export default Homepage
