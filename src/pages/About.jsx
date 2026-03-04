import React from 'react'
import Title from '../components/Title'
import aboutus from '../assets/aboutus.jpg';
const About = () => {
  return (
    <div>
        <div className='text-2xl text-center pt-8 border-t'>
            <Title text1={'ABOUT '} text2 = {' WEBSITE'}/>
        </div>
        <div className='my-10 flex flex-col md:flex-row gap-16'>
            <img src={aboutus} alt="" className='w-full md:max-w-[450px]'/>
            <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray'>
            <p>Jewelry design is a complex art form that combines aesthetics, craftsmanship, and material science. Traditionally, creating unique jewelry patterns requires extensive expertise and creativity. With the advent of DL, there is an opportunity to augment the design process by leveraging AI's ability to generate intricate and diverse patterns. This paper presents a novel approach to using DL for generating jewelry design patterns, aiming to enhance creativity, efficiency, and customization in the jewelry industry.</p>

            {/* <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At est corporis exercitationem ipsum necessitatibus, ullam minus magni maiores hic possimus asperiores! Praesentium inventore dolorum accusamus nostrum esse totam culpa quasi.</p> */}
            <b className='text-gray-800'>Our Mission</b>
            <p> By leveraging the capabilities of AI, we aims to enable the generation of intricate and diverse jewelry design patterns that can inspire designers, reduce the time spent on ideation, and offer more personalized options to clients. This approach not only supports traditional craftsmanship but also pushes the boundaries of innovation within the jewelry industry, making the design process more accessible, efficient, and scalable while maintaining artistic integrity.</p>
            </div>
            {/* <div className='text-2xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'}/>
            </div>
            <div className='flex flex-col md-flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 sm:py-20 flex-col gap-5'>
                    <b></b>
                    
                </div>
            </div> */}
        </div>
    </div>
  )
}

export default About