import Image from 'next/image'
import React from 'react'
// import Image from 'next/image';
// import R from '../images/R.png';

const Information = () => {
  return (
    <div className="w-full h-full" data-theme="light">
    <div className='xl:mx-36 md:mx-26 mx-10 flex sm:flex-col flex-col xl:flex-row md:flex-row'>
    <div className="xl:flex xl:flex-col py-7 ">
      <div className="relative xl:w-[600px] w-72 [animation-timeline:view()]  animation-range-entry animate-appear  group">
        <Image
          src="https://storage.googleapis.com/vinfast-data-01/pin-tramsac-2_1660273363.png"
          alt="car"
          className="xl:w-full md:w-full w-72 h-auto"
        />
        {/* Phần hiện thêm khi hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-[0.4] text-white text-left opacity-0 transform -translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <div className="p-4">
            <p className='xl:text-lg text-xs'>Với phương châm luôn đặt lợi ích Khách hàng lên hàng đầu, VinFast áp dụng chính sách cho thuê pin độc đáo, ưu việt và khác biệt với tất cả các mô hình cho thuê pin từ trước tới nay trên thế giới.</p>
          </div>
        </div>
  
        {/* Khi hover, đẩy chữ "Pin & Trạm sạc ô tô điện" lên */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-5 text-white text-left group-hover:transform group-hover:translate-y-[-100px] transition-all duration-500">
          <h2 className="xl:text-2xl text-base font-bold">Pin & Trạm sạc ô tô điện</h2>
        </div>
      </div>

      <div className="relative xl:w-[600px] w-72 mt-7 animate-appearright [animation-timeline:view()]  animation-range-entry group">
        <Image
          src="	https://storage.googleapis.com/vinfast-data-01/pin-tramsac-1_1660273470.png"
          alt="car"
          className="xl:w-full md:w-full w-72 h-auto object-cover bg-cover"
        />
        {/* Phần hiện thêm khi hover */}
        <div className="absolute xl:ml-3 lg:ml-3 md:xl-3 sm:xl-3 ml-2 bottom-0 left-0 right-0 bg-black bg-opacity-[0.4] text-white text-left opacity-0 transform -translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <div className="p-4 ml-3">
            <p className='xl:text-lg text-xs'>Nếu Khách hàng di chuyển nhiều hàng tháng thì chi phí thuê pin theo gói cố định và tiền sạc điện sẽ rẻ hơn tiền xăng hàng tháng khi dùng xe xăng cùng hạng.</p>
          </div>
        </div>
  
        {/* Khi hover, đẩy chữ "Pin & Trạm sạc ô tô điện" lên */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-5 text-white text-left group-hover:transform group-hover:translate-y-[-100px] transition-all duration-500">
          <h2 className="xl:text-2xl text-base font-bold ml-3">Trạm sạc ô tô điện</h2>
        </div>
      </div>

     
    </div> 
    <div className='flex flex-col justify-center'>
         <div className='xl:ml-32 md:ml-26 ml-4 animate-appearright [animation-timeline:view()]  animation-range-entry'>
            <span className='xl:text-2xl md:text-xl font-medium text-xl'>Thiết bị sạc di động</span>
            <br/>
            <span className='xl:text-lg'>VinFast cung cấp đa dạng giải pháp sạc để đáp ứng nhu cầu sử dụng của khách hàng một cách thuận tiện nhất.</span>
        </div>

        <div className='xl:ml-32 md:ml-36 ml-1 animate-appearbottom [animation-timeline:view()]  animation-range-entry '>
        <Image src="https://th.bing.com/th/id/R.4a980c83c4342c4cce95b4c93778d205?rik=CM6Qhrc08cTz5w&riu=http%3a%2f%2ffibertronics-inc.com%2fsites%2fdefault%2ffiles%2fstyles%2fmax_650x650%2fpublic%2f2023-01%2fClassic-7-Fibertronics-com.png%3fitok%3dIoM2Z1X3&ehk=w96MABj6d%2fhIOQbQYZbqHzlHpZDzHhJDjAvKlNWujfw%3d&risl=&pid=ImgRaw&r=0"
            className="xl:h-[600px] xl:w-[800px] " alt={''}        
        />
        </div>
    </div>
    </div>
  </div>
  
  
  )
}

export default Information