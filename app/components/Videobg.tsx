import React from 'react'

const Videobg = () => {
  return (
    <div className='w-full py-14 ' data-theme="light" >
        <div className='xl:mx-36 mt-14 md:mx-26 mx-10 animate-appeartop [animation-timeline:view()] animation-range-entry '>
        <span className='font-bold xl:text-5xl md:text-4xl text-3xl w-full text-slate-600 font-serif '>Xe nhỏ giá trị lớn</span>
        <br />
        <span className='xl:text-xl md:text-lg sm:text-base text-xs'>Với thiết kế tối giản, nhỏ gọn, cá tính và năng động, VinFast VF 3 sẽ luôn cùng bạn hoà nhịp với xu thế công nghệ di chuyển xanh toàn cầu, trải nghiệm giá trị trên mỗi hành trình, và tự do thể hiện phong cách sống.</span>
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
    </div>
  )
}

export default Videobg