'use client'
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BackgroundSlider = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 4; // We have 4 pairs of images (desktop and mobile)
  
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };
  
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };
  
    useEffect(() => {
      const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(interval);
    }, []);
  
    const images = [
      {
        desktop: "https://static-cms-prod.vinfastauto.com/vf3-20250225.webp",
        mobile: "https://static-cms-prod.vinfastauto.com/vf3-20250225-mobile.webp",
        
      },
      {
        desktop: "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Website_3060x1406px.png",
        mobile: "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png",
      },
      {
        desktop: "https://static-cms-prod.vinfastauto.com/xmd_20240715_1721017659.jpg",
        mobile: "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png",
      },
      {
        desktop: "https://static-cms-prod.vinfastauto.com/Banner-Home.jpg",
        mobile: "https://static-cms-prod.vinfastauto.com/VinFast_VF%208_Mobile_Lux-540x960.jpg",
      },
    ];
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full">
            <img
              src={image.desktop}
              alt={`Background ${index + 1}`}
              width={100}
              height={100} 
              className="object-cover w-full h-full md:block hidden transition-opacity duration-500 ease-in-out"
            />
            <img
              src={image.mobile}
              width={100}
              height={100} 
              alt={`Background ${index + 1} mobile`}
              className="object-cover w-full h-full md:hidden transition-opacity duration-500 ease-in-out"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  //   <div className="relative w-full h-full overflow-hidden" aria-hidden="true">
  //   <div className="flex w-full h-full animate-autoslide ">
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Website_3060x1406px.png"
  //     alt="Background 1"
  //     className="object-cover w-full md:block hidden h-full  transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png"
  //     alt="Background 1 mobile"
  //     className="object-cover w-full md:hidden h-full  transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/Slider-VF8-25Aug-Desktop_3060x1406.jpg"
  //     alt="Background 2"
  //     className="object-cover w-full h-full md:block hidden transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/VinFast_VF%208_Mobile_Lux-540x960.jpg"
  //     alt="Background 2 mobile"
  //     className="object-cover w-full h-full md:hidden transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/xmd_20240715_1721017659.jpg"
  //     alt="Background 3"
  //     className="object-cover w-full h-full md:block hidden  transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png"
  //     alt="Background 3 mobile"
  //     className="object-cover w-full h-full md:hidden transition-opacity duration-500 ease-in-out"
  //   />
  //   <img
  //     src="https://static-cms-prod.vinfastauto.com/Banner-Home.jpg"
  //     alt="Background 4"
  //     className="object-cover w-full h-full md:block hidden transition-opacity duration-500 ease-in-out"
  //   />
  //    <img
  //     src="https://static-cms-prod.vinfastauto.com/VinFast_VF%208_Mobile_Lux-540x960.jpg"
  //     alt="Background 4 moblie"
  //     className="object-cover w-full h-full md:hidden transition-opacity duration-500 ease-in-out"
  //   />
  // </div>
  /* <div className="absolute inset-0 flex flex-col justify-center z-10 mb-10 animate-fadeleft transition-all">
    <h1 className="xl:text-8xl font-serif font-bold text-white ml-20 md:ml-10 md:text-4xl sm:text-sm sm:mx-5 ">
      VinFast
    </h1>
    <br />
    <span className= "xl:text-2xl text-slate-50 font-mono font-medium ml-10 lg:text-lg lg:mx-5 sm:mx-5 sm:text-base ">
      VinFast là hãng xe ô tô đầu tiên của Việt Nam,
    </span>
    <span className=" xl:text-2xl text-slate-50 font-mono font-medium ml-10 lg:text-lg sm:mx-5 sm:text-base ">
      là biểu tượng trong ngành công nghiệp ô tô Việt với các dòng xe điện và ô tô xăng hiện đại,
    </span>
    <span className=" xl:text-2xl text-slate-50 font-mono font-medium ml-10 lg:text-lg sm:mx-5 sm:text-base ">
      Vì thế hãy Chọn vinfast chọn thành công nhanh tay đặt hàng ngay
    </span>
  </div>

  <div className="absolute flex justify-end w-full bottom-0 left-0 md:left-auto md:right-0 animate-faderight transition-all">
  <img
    className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] mx-0"
    src="https://free.vector6.com/wp-content/uploads/2021/03/0000000097-xe-viet-nam-vinfast-lux-a-png-3.png"
    alt="car"
  /> 
</div>*/



  );
}
export default BackgroundSlider