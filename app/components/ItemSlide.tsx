import React from 'react'
import img from 'next/image';
const Itemslide = () => {
  return (
    <div className='flex w-full overflow-hidden group mb-16 mt-16'>
    <div className='flex justify-between animate-loop-scroll group-hover:paused'>
        <div className="w-96 h-10 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" 
        />
  </figure>
</div>

<div className="w-96 h-10 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" width={1000}
      height={1000}
      />
  </figure>
</div>

<div className="w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" 
        />
  </figure>
</div>

<div className="w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" 
        />
  </figure>
</div>
    </div>

    <div className='flex justify-between animate-loop-scroll group-hover:paused' aria-hidden="true">
        <div className=" w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!"
         />
  </figure>
</div>

<div className=" w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!"
         />
  </figure>
</div>

<div className=" w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" />
  </figure>
</div>

<div className="w-96 mx-4">
  <figure>
    <img
      src="https://vinfastquangninh.com.vn/wp-content/uploads/2019/02/logo-1.png"
      alt="car!" />
  </figure>
</div>
    </div>
    </div>
  )
}

export default Itemslide