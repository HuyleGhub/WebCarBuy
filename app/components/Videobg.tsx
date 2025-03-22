import React from 'react'
import { FaCheckCircle, FaChargingStation, FaHeadset } from "react-icons/fa";

const Videobg = () => {
  return (
    <div className='w-full  ' data-theme="light" >
        <div className='xl:mx-36  md:mx-26 mx-10 mb-14 animate-appeartop [animation-timeline:view()] animation-range-entry text-center '>
        <span className='font-semibold text-center xl:text-3xl md:text-2xl text-xl w-full font-serif '>Explore the VinFast Family
        quality & comfort</span>
        <br />
        <span className='xl:text-xl md:text-lg sm:text-base text-xs'>VinFast’s design language blends sporty curves, luxurious strokes, and formidable presence.
        It optimizes performance, functionality, and elegant simplicity, setting a new standard for electric car companies.</span>
        </div>
        <div className='xl:mx-36 md:mx-26 mx-10 animate-appeartop [animation-timeline:view()]  animation-range-entry'>
        <video
        className="w-full "
        controls
        loop
        muted
        autoPlay
        playsInline
        poster="https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwd4dadefc/reserves/VF3/vf3.jpg"
      >
        <source
          src="https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw3bedfd7b/reserves/VF3/TVC_VF3_Online_1080.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      </div>
      <div>
      <section className="text-center py-12 px-4 bg-white animate-appeartop [animation-timeline:view()] animation-range-entry">
      <h2 className="text-3xl font-semibold">VinFast’s Experience</h2>
      <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
        VinFast, the innovative new electric car company, prioritizes premium
        craftsmanship and high-quality parts in crafting its EVs. Engineered for
        safety, reliability, and comfort on every journey.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Warranty Section */}
        <div className="border-r md:border-r md:border-gray-300 p-4 flex flex-col items-center">
          <FaCheckCircle className="text-4xl text-black" />
          <h3 className="text-xl font-semibold mt-4">10 Year / 125,000 mile warranty</h3>
          <a href="#" className="text-blue-500 mt-2 hover:underline">
            Explore Warranty →
          </a>
        </div>

        {/* Charging Section */}
        <div className="border-r md:border-r md:border-gray-300 p-4 flex flex-col items-center">
          <FaChargingStation className="text-4xl text-black" />
          <h3 className="text-xl font-semibold mt-4">95% EV Charging Station Coverage</h3>
          <a href="#" className="text-blue-500 mt-2 hover:underline">
            Explore Charging →
          </a>
        </div>

        {/* Service Section */}
        <div className="p-4 flex flex-col items-center">
          <FaHeadset className="text-4xl text-black" />
          <h3 className="text-xl font-semibold mt-4">Outstanding Service</h3>
          <a href="#" className="text-blue-500 mt-2 hover:underline">
            Explore Services →
          </a>
        </div>
      </div>
    </section>
      </div>
    </div>
  )
}

export default Videobg