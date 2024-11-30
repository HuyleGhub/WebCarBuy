"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '@/app/components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Car {
  idXe: number;
  currentStock: number;
  TenXe: string;
  GiaXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string | string[];  // Updated to handle both string and array
  NamSanXuat: string;
  loaiXe: {
    TenLoai: string;
    NhanHieu: string;
  };
}

const Category = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [images, setImages] = useState<string[]>([])

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      
      const stockCheck = await fetch('/api/giohang/check-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idXe: car?.idXe }),
      })
      
      const stockData = await stockCheck.json()
      
      if (!stockData.available) {
        toast.error('Xin lỗi, xe này hiện không còn trống để đặt hàng.')
        return
      }

      const response = await fetch('/api/giohang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idXe: car?.idXe,
          SoLuong: quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Không thể thêm vào giỏ hàng')
      }

      const toastPromise = toast.promise(
        new Promise(resolve => setTimeout(resolve, 2500)),
        {
          loading: 'Đang thêm vào giỏ hàng...',
          success: 'Đã thêm vào giỏ hàng thành công!',
          error: 'Có lỗi xảy ra',
        },
        {
          duration: 3000,
        }
      )

      await toastPromise
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/Cart')

    } catch (err) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.')
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetch(`/api/xe/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          if (data.error) {
            throw new Error(data.error)
          }
          setCar(data)
          // Parse the images
          let imageArray: string[] = []
          if (typeof data.HinhAnh === 'string') {
            // Split by either comma or pipe
            imageArray = data.HinhAnh.split(/[,|]/).map((url: string) => url.trim()).filter(Boolean)
          } else if (Array.isArray(data.HinhAnh)) {
            imageArray = data.HinhAnh
          }
          setImages(imageArray)
          setLoading(false)
        })
        .catch(err => {
          console.error('Lỗi khi lấy thông tin xe:', err)
          setError(err.message)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme="light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  )
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-bold text-red-600">{error}</div>
    </div>
  )

  if (!car) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-bold text-gray-800">Không tìm thấy thông tin xe</div>
    </div>
  )

  return (
    <div className="w-full h-full pt-24" data-theme="light">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          duration: 2000,
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
      <div className="px-24 pb-24 w-full h-full flex flex-col">
        <div className="pb-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" />
            </svg>
            <span>Quay lại trang chủ</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8">Chi tiết sản phẩm</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 xl:w-[1000px] xl:h-[500px] relative">
              {images.length > 0 && (
                <img 
                  className="xl:h-[500px] xl:w-full object-cover md:w-48"
                  src={images[currentImageIndex]}
                  alt={car.TenXe}
                />
              )}
            </div>
            <div className="flex flex-col w-full h-full">
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{car.loaiXe.NhanHieu}</div>
                <h2 className="block mt-1 text-3xl leading-tight font-bold text-black">{car.TenXe}</h2>
                <p className="mt-2 text-gray-500">{car.loaiXe.TenLoai}</p>
              </div>
              <div className="ml-8 flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-24 relative cursor-pointer border-2 ${
                      index === currentImageIndex ? 'border-indigo-500' : 'border-transparent'
                    } hover:border-indigo-500`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${car.TenXe} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Thông số kỹ thuật</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">Động cơ:</span>
                    <span>{car.DongCo}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">Màu sắc:</span>
                    <span>{car.MauSac}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">Năm sản xuất:</span>
                    <span>{car.NamSanXuat}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">Trạng thái:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      car.TrangThai === 'Còn hàng' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.TrangThai}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Giá bán</h3>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.GiaXe)}
                </p>
                <div className="flex">
                  <button className="mt-4 w-48 bg-indigo-600 text-white py-2 mx-4 rounded-md hover:bg-indigo-700 transition duration-300">
                    <Link href={`/Datcoc?id=${car.idXe}`}>Đặt cọc ngay</Link>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || car.TrangThai !== 'Còn Hàng'}
                    className={`mt-4 w-48 ${
                      car.TrangThai === 'Còn Hàng'
                        ? 'bg-slate-600 hover:bg-black'
                        : 'bg-gray-400 cursor-not-allowed'
                    } text-white py-2 mx-4 rounded-md transition duration-300`}
                  >
                    {addingToCart 
                      ? 'Đang thêm...' 
                      : car.TrangThai !== 'Còn Hàng'
                      ? 'Hết hàng'
                      : 'Thêm vào giỏ hàng'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Category