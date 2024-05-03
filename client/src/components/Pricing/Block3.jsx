import React from 'react'
import { downArrow_icon } from '../../assets/icon'

const Block3 = () => {
  return (
    <div className='sm:px-20 lg:px-[120px] px-6  sm:py-20 py-8 bg-blue-50'>
      <h2 className='sm:mb-11 mb-7 leading-normal text-center font-extatica sm:leading-11  gradient-text font-semibold w-full h-full sm:text-[36px] text-[28px]'>Questions you might have before signing up</h2>

      <div className='flex flex-col sm:gap-4 gap-3'>
      
			<details className="group border-[1px] rounded-md border-slate-300 w-[100%] p-5 bg-white">
				<summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
					<span className='font-inter text-neutral-600 text-[20px] font-medium leading-6'> Is there a minimum number of user licenses that I need to purchase?</span>
					<span className="transition group-open:rotate-180 w-9 h-9 bg-blue-50 items-center flex justify-center rounded-md shrink-0">
                <img src={downArrow_icon} className='w-8 h-8'/>

          </span>
				</summary>
				<p className="text-neutral-400 font-inter leading-8  text-[16px] mt-3 group-open:animate-fadeIn">
        Is there a minimum number of active user licenses that I need to purchase?
-
      Yes. Please find the number of minimum users required under each plan, below:
      <ul className='list-disc pl-8'>
        <li>   Standard - 3</li>
        <li>   Premium - 3</li>
        <li>    Custom - 100</li>
      </ul>
   
      
     
      However, there is no upper limit on the number of active user licenses that you can purchase.
				</p>
			</details>
			<details className="group border-[1px] rounded-md border-slate-300 w-[100%] p-5 bg-white">
				<summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
					<span className='font-inter text-neutral-600 text-[20px] font-medium leading-6'> Can additional users (apart from the purchased active ones) use the application during the billing cycle?</span>
					<span className="transition group-open:rotate-180 w-9 h-9 bg-blue-50 items-center flex justify-center rounded-md shrink-0">
                <img src={downArrow_icon} className='w-8 h-8'/>

          </span>
              
				</summary>
				<p className="text-neutral-400 font-inter leading-8 text-[16px] mt-3 group-open:animate-fadeIn">
        You can add as many users as you wish to Expense Book and they can use the product. However, if any of them create expenses or expense reports, they will be charged at a cost.


				</p>
			</details>
			<details className="group border-[1px] rounded-md border-slate-300 w-[100%] p-5 bg-white">
				<summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
					<span className='font-inter text-neutral-600 text-[20px] font-medium leading-6'>What is the cost for an additional user?</span>
					<span className="transition group-open:rotate-180 w-9 h-9 bg-blue-50 items-center flex justify-center rounded-md shrink-0">
                <img src={downArrow_icon} className='w-8 h-8'/>

          </span>
				</summary>
				<p className="text-neutral-400 font-inter leading-8 text-[16px] mt-3 group-open:animate-fadeIn">
        Additional users will be charged at:
        
         <ul className='pl-8'>
    <li>
        <strong>Standard Plan:</strong>
        <ul>
            <li>Monthly: $ 9/per active user</li>
            <li>Yearly Subscription: $ 6/per active user/month</li>
        </ul>
    </li>
    <li>
        <strong>Premium Plan:</strong>
        <ul>
            <li>Monthly: $ 12/per active user</li>
            <li>Yearly Subscription: $ 9/per active user/month</li>
        </ul>
    </li>
</ul>

				</p>
			</details>
			<details className="group border-[1px] rounded-md border-slate-300 w-[100%] p-5 bg-white">
				<summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
					<span className='font-inter text-neutral-600 text-[20px] font-medium leading-6'> What will be the total cost if I purchase 10 active user licenses, but 15 employees were active during a particular month?</span>
					<span className="transition group-open:rotate-180 w-9 h-9 bg-blue-50 items-center flex justify-center rounded-md shrink-0">
                <img src={downArrow_icon} className='w-8 h-8'/>

          </span>
				</summary>
				<p className="text-neutral-400 font-inter leading-8 text-[16px] mt-3 group-open:animate-fadeIn">
        We would be charging the additional active users for that month at the monthly rate.<br/><br/>

        For example, if you've purchased 10 active user licenses under the Premium Yearly plan, but 15 people are active users of  Expense Book in a particular month, the additional 5 users will be charged at $ 12 /user /month. So, you will be sent an invoice for the extra usage for that particular month for 5* 12 = $ 60 .
				</p>
			</details>
			<details className="group border-[1px] rounded-md border-slate-300 w-[100%] p-5 bg-white">
				<summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
					<span className='font-inter text-neutral-600 text-[20px] font-medium leading-6'> Can I try the product before purchasing it?</span>
          <span className="transition group-open:rotate-180 w-9 h-9 bg-blue-50 items-center flex justify-center rounded-md shrink-0">
                <img src={downArrow_icon} className='w-8 h-8'/>

          </span>
				</summary>
				<p className="text-neutral-400 font-inter leading-6 text-[16px] mt-3 group-open:animate-fadeIn">
        <a className='text-blue-300 font-medium cursor-pointer'> <span>Sign up for a 14-day free trial.</span></a> Enjoy all of  Expense Book's features without providing your credit card information.
				</p>
			</details>
			
		</div>

      
      
    </div>
  )
}

export default Block3

