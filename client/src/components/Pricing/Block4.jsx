import React from 'react'
import Form from '../Form'

const Block4 = () => {
  return (
    <div className='sm:px-[120px] px-6 sm:py-20 py-12 flex justify-center items-center flex-col bg-gradient-to-r from-blue-100/20  to-blue-50' >
      <h1 className='max-w-[780px] w-auto leading-normal text-center font-extatica sm:leading-[56px]  gradient-text font-semibold  h-full sm:text-[36px] text-[28px]'>Experience advanced expense management.
Take ExpenseBook for a spin.</h1>
<div className='w-full'>
  <Form/>
</div>
    </div>
  )
}

export default Block4