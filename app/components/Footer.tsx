import React from 'react'
 import Image from 'next/image'
// import car from '../images/car2.png'
const Footer = () => {
  return (
    <div className='w-full h-full' data-theme="light">
        <div className='relative'>
        <div className='w-full h-auto'>
       <img
                      src='https://cmu-cdn.vinfast.vn/2024/08/f26f4d46-footer2_980x260px_vf5.png'
                      className='w-full xl:h-96 h-60'
                      width={100}
                      height={100} alt={''}              
       />
       </div>
       {/* <div className="absolute inset-0 bg-black opacity-10"></div>
       <div className='absolute xl:top-40 xl:left-24 top-14 '>
            <span className='xl:text-3xl xl:font-bold text-lg font-bold'>Đăng Ký</span>
            <br />
            <span className='xl:text-xl xl:font-medium text-sm font-medium'>Để Nhận Thêm Nhiều Tin Tức Về Chúng Tôi</span>
            <br />
            <span className='xl:text-xl xl:font-medium text-sm font-medium'> Và Những Mẫu Xe Mới Sắp Ra Mắt</span>
            <br/>
            <button className="btn bg-[#1464F4] text-black sm:btn-sm md:btn-md lg:btn-lg">Đăng Ký Ngay</button>
       </div> */}
       </div>

       <div>
       <footer className="bg-[#e9ecf0]">
            <div className="container mx-auto p-4">
                <div className="flex flex-col lg:flex-row">
                    {/* Thông tin công ty */}
                    <div className="lg:w-1/2 p-4">
                        <div className="logo mb-4">
                            <Image 
                                alt="Công ty TNHH Kinh doanh Thương mại và Dịch vụ VinFast" 
                                src="https://vinfastauto.com/themes/porto/img/new-home-page/VinFast-logo.svg"
                                width={100}
                                 height={100}
                                className="mb-2" 
                            />
                            <div className="info text-black">
                                <p>Công ty TNHH Kinh doanh Thương mại và Dịch vụ VinFast</p>
                                <div>
                                    <strong className='text-red-600'>MST/MSDN:</strong> 0108926276 do Sở KHĐT TP Hà Nội cấp lần đầu ngày 01/10/2019 và các lần thay đổi tiếp theo.
                                </div>
                                <div>
                                    <strong>Địa chỉ trụ sở chính:</strong> Số 7, đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, Phường Việt Hưng, Quận Long Biên, Thành phố Hà Nội, Việt Nam
                                </div>
                            </div>
                        </div>
                        {/* Hệ sinh thái */}
                        <div className="ecosystem text-black">
                            <p className="menu-title font-bold text-red-600">Hệ sinh thái</p>
                            <ul className="menu">
                                <li className="menu-item">
                                    <a href="https://vinhomes.vn/vi" rel="nofollow">Vinhomes</a>
                                </li>
                                <li className="menu-item">
                                    <a href="https://vinmec.com/vi/">Vinmec</a>
                                </li>
                                <li className="menu-item">
                                    <a href="https://vinpearl.com/">Vinpearl</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="lg:w-1/3 p-4">
                        <div className="menu-footer">
                            <div className="block-left">
                                <div className="menu-item">
                                    <p className="menu-title text-black"><a href="/ve-chung-toi">VỀ VINFAST</a></p>
                                </div>
                                <div className="menu-item">
                                    <p className="menu-title text-black"><a href="/ve-vingroup">VỀ VINGROUP</a></p>
                                </div>
                                <div className="menu-item">
                                    <p className="menu-title text-black">TIN TỨC</p>
                                </div>
                                <div className="menu-item">
                                    <p className="menu-title text-black"><a href="/uu-dai">ƯU ĐÃI</a></p>
                                </div>
                                <div className="menu-item">
                                    <p className="menu-title text-black"><a href="/tim-kiem-showroom-tram-sac">Showroom & Đại lý</a></p>
                                </div>
                                <div className="menu-item">
                                    <p className="menu-title text-black">Điều khoản chính sách</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="lg:w-1/4 p-4">
                        <div className="cskh">
                            <div className="hotline-email">
                                <div className="hotline-title text-red-600">HOTLINE</div>
                                <div className="hotline text-black">
                                    <a href="tel:1900232389" className="flex items-center">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                            <path d="M5.51667 8.99167C6.71667 11.35 8.65 13.2833 11.0083 14.4833L12.8417 12.65C13.075 12.4167 13.4 12.35 13.6917 12.4417C14.625 12.75 15.625 12.9167 16.6667 12.9167C16.8877 12.9167 17.0996 13.0045 17.2559 13.1607C17.4122 13.317 17.5 13.529 17.5 13.75V16.6667C17.5 16.8877 17.4122 17.0996 17.2559 17.2559C17.0996 17.4122 16.8877 17.5 16.6667 17.5C12.9094 17.5 9.30609 16.0074 6.64932 13.3507C3.99256 10.6939 2.5 7.09057 2.5 3.33333C2.5 3.11232 2.5878 2.90036 2.74408 2.74408C2.90036 2.5878 3.11232 2.5 3.33333 2.5H6.25C6.47101 2.5 6.68298 2.5878 6.83926 2.74408C6.99554 2.90036 7.08333 3.11232 7.08333 3.33333C7.08333 4.375 7.25 5.375 7.55833 6.30833C7.65 6.6 7.58333 6.925 7.35 7.15833L5.51667 8.99167Z" fill="#8A8A8A"></path>
                                        </svg>
                                        <span className='text-blue-500'>1900 23 23 89</span>
                                    </a>
                                </div>
                                <div className="email text-black">
                                    <a href="mailto:support.vn@vinfastauto.com" className="flex items-center">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                            <path d="M16.668 6.66683L10.0013 10.8335L3.33464 6.66683V5.00016L10.0013 9.16683L16.668 5.00016V6.66683ZM16.668 3.3335H3.33464C2.40964 3.3335 1.66797 4.07516 1.66797 5.00016V15.0002C1.66797 15.4422 1.84356 15.8661 2.15612 16.1787C2.46868 16.4912 2.89261 16.6668 3.33464 16.6668H16.668C17.11 16.6668 17.5339 16.4912 17.8465 16.1787C18.159 15.8661 18.3346 15.4422 18.3346 15.0002V5.00016C18.3346 4.55814 18.159 4.13421 17.8465 3.82165C17.5339 3.50909 17.11 3.3335 16.668 3.3335Z" fill="#8A8A8A"></path>
                                        </svg>
                                        <span className='text-blue-500'>support.vn@vinfastauto.com</span>
                                    </a>
                                </div>
                            </div>
                            {/* Kết nối với VinFast */}
                            <div className="connect-vf mt-4">
                                <div className="connect-title font-bold text-red-600">Kết nối với VinFast</div>
                                <div className="social flex space-x-4">
                                    <a className="social-item" href="https://www.facebook.com/VinFastAuto.Official" target="_blank" title="Facebook" rel="nofollow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.334 2.5H16.668C16.895 2.5 17.071 2.612 17.184 2.834C17.268 3.003 17.337 3.194 17.337 3.334V7.5H20V10H17.337V20H14.1667V10H12.5V7.5H14.1667V5.83333C14.1667 4.975 14.495 4.16667 15.5 4.16667H17.337V2.5H13.334Z" fill="#8A8A8A"></path>
                                        </svg>
                                    </a>
                                    <a className="social-item" href="https://www.youtube.com/channel/UCu1Je1p1lqxiyXBUi0vhRAg" target="_blank" title="Youtube" rel="nofollow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 10.0004C20 10.6429 19.974 11.2796 19.9034 11.8863C19.7483 13.8968 19.0243 15.7044 17.6378 17.0908C16.4203 18.3199 14.6378 19.1383 12.5005 19.1383C10.3657 19.1383 8.57727 18.3199 7.36783 17.0908C6.10339 15.7698 5.63959 14.0276 5.63959 10.0004C5.63959 5.9732 6.10339 4.23095 7.36783 2.90993C8.57727 1.68083 10.3657 0.8624 12.5005 0.8624C14.6378 0.8624 16.4203 1.68083 17.6378 2.90993C19.0243 4.29735 19.7483 6.10492 19.9034 8.11544C19.974 8.72223 20 9.35887 20 10.0004ZM8.86273 10.0004L12.5005 7.5004V12.5004L8.86273 10.0004Z" fill="#8A8A8A"></path>
                                        </svg>
                                    </a>
                                    <a className="social-item" href="https://www.instagram.com/vinfastauto/" target="_blank" title="Instagram" rel="nofollow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0004 0C4.47273 0 0 4.47273 0 10.0004C0 15.5273 4.47273 20.0004 10.0004 20.0004C15.5273 20.0004 20.0004 15.5273 20.0004 10.0004C20.0004 4.47273 15.5273 0 10.0004 0ZM10.0004 16.6668C7.99273 16.6668 6.3334 15.0075 6.3334 12.5004C6.3334 10.0075 7.99273 8.33341 10.0004 8.33341C12.0075 8.33341 13.6668 10.0075 13.6668 12.5004C13.6668 15.0075 12.0075 16.6668 10.0004 16.6668ZM15.0004 5.00041C14.3754 5.00041 14.0004 5.37541 14.0004 6.00041C14.0004 6.62541 14.3754 7.00041 15.0004 7.00041C15.6254 7.00041 16.0004 6.62541 16.0004 6.00041C16.0004 5.37541 15.6254 5.00041 15.0004 5.00041Z" fill="#8A8A8A"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
       </div>
    </div>
  )
}

export default Footer