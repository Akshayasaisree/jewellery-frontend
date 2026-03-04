import React from 'react'
import logo from '../assets/logo.jpg';
function Footer() {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={logo} alt="" className='mb-5 w-32'/>
                <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet quidem, similique aliquam molestiae reprehenderit quae dignissimos, dicta ex iure doloribus ullam officiis? Quibusdam obcaecati deleniti atque illum molestiae distinctio sequi.

                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    

                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>
                    Get in touch
                </p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+91 9876543210</li>
                    <li>contact@stolidi.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>COPYRIGHTS 2024@stolidi.com - All Rights Reserved</p>

        </div>
    </div>
  )
}

export default Footer