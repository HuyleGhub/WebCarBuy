"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from "next/image";

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string;
  NamSanXuat: string;
  idLoaiXe: number; // Add this field
  loaiXe?: {      // Make loaiXe optional
    idLoaiXe: number;
    TenLoai: string;
    NhanHieu: string;
  };
}

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string;
}

interface SortableCarItemProps {
  car: Car;
  category?: LoaiXe; // Add category prop
}

const SortableCarItem = ({ car, category }: SortableCarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: car.idXe });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
    <div
      className={`card bg-base-100 w-full sm:w-[90%] md:w-72 xl:w-72 h-auto md:h-80 xl:h-80 mx-auto md:ml-6 mb-5 shadow-sm relative ${
        isHovered ? "animate-borderrun" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute bg-gradient-to-bl from-orange-600 to-orange-400 w-full sm:w-[303px] h-full sm:h-[335px] z-[-1] -top-2 -left-2 rounded-2xl ${
          isHovered ? "animate-spinrun" : "hidden"
        }`}
      ></div>
      <div className="w-full sm:w-[303px] h-auto sm:h-[303px] p-4 sm:p-0">
        <figure className="px-4 sm:px-10 w-full">
          <Image
            src={
              Array.isArray(car.HinhAnh)
                ? car.HinhAnh[0]
                : car.HinhAnh.split("|")[0]
            }
            alt={car.TenXe}
            width={100}
            height={100}
            className="rounded-xl w-full sm:w-64 h-auto sm:h-32 object-cover"
          />
        </figure>
        <div className="card-body items-center text-center p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
            <h2 className="card-title text-lg sm:text-xl w-full">{car.TenXe}</h2>
            {category && (
              <p className="text-gray-600 text-sm sm:text-base">{category.TenLoai}</p>
            )}
          </div>
          
          <p className="flex justify-start w-full mt-2">
            <span className="text-purple-600 text-xl sm:text-2xl font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(car.GiaXe)}
            </span>
          </p>
          <div className="card-actions flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-2">
            <button className="btn bg-[#1464F4] w-full sm:w-24 text-white text-sm">
              <Link href={`Datcoc?id=${car.idXe}`}>Đặt Cọc</Link>
            </button>
            <Link
              href={`Carcategory?id=${car.idXe}`}
              className="btn btn-outline w-full sm:w-auto text-sm"
            >
              Xem Chi Tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  </li>
);
};

const Product = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<LoaiXe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const carsPerPage = 4;

  useEffect(() => {
    Promise.all([
      fetch('/api/xe'),
      fetch('/api/loaixe')
    ])
      .then(([carsRes, categoriesRes]) => Promise.all([carsRes.json(), categoriesRes.json()]))
      .then(([carsData, categoriesData]) => {
        setCars(carsData);
        setCategories(categoriesData);
        setDisplayedCars(carsData.slice(0, carsPerPage));
        setLoading(false);
      })
      .catch(e => {
        console.error("Error loading data:", e);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredCars = selectedCategory
      ? cars.filter(car => car.idLoaiXe === selectedCategory)
      : cars;
    setDisplayedCars(filteredCars.slice(0, carsPerPage));
  }, [selectedCategory, cars]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" data-theme="light">
        <div className="loading loading-spinner text-blue-600 loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen" data-theme="light">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  const loadMore = () => {
    const currentLength = displayedCars.length;
    const filteredCars = selectedCategory
      ? cars.filter(car => car.idLoaiXe === selectedCategory)
      : cars;
    const newCars = filteredCars.slice(currentLength, currentLength + carsPerPage);
    setDisplayedCars(prevCars => [...prevCars, ...newCars]);
  };

  const showLess = () => {
    setDisplayedCars(displayedCars.slice(0, carsPerPage));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDisplayedCars((items) => {
        const oldIndex = items.findIndex((item) => item.idXe === active.id);
        const newIndex = items.findIndex((item) => item.idXe === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // Function to get category by ID
  const getCategoryById = (categoryId: number) => {
    return categories.find(category => category.idLoaiXe === categoryId);
  };

  return (
    <div className="w-full h-full flex flex-col" data-theme="light">
      <div className="px-4 sm:px-6 xl:mx-20 md:mx-10 mt-16 sm:mt-24">
        <br />
        <div className="border-b-4 border-blue-500 mt-3 sm:mt-5"></div>

        {/* Category Selection - Mobile Scrollable */}
        <div className="mt-6 h-12 sm:mt-8 mb-6 sm:mb-8 overflow-x-auto animate-appear [animation-timeline:view()] animation-range-entry">
          <div className="flex flex-nowrap sm:flex-wrap gap-4 text-2xl sm:text-3xl h-9 min-w-max sm:min-w-0 sm:justify-between  pb-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`${!selectedCategory ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'} 
                whitespace-nowrap hover:border-b-2 border-blue-500 hover:text-blue-500 italic font-bold px-2`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.idLoaiXe}
                onClick={() => handleCategorySelect(category.idLoaiXe)}
                className={`${selectedCategory === category.idLoaiXe ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'} 
                  whitespace-nowrap hover:border-b-2 border-blue-500 hover:text-blue-500 italic font-bold px-2`}
              >
                {category.TenLoai}
              </button>
            ))}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayedCars.map(car => car.idXe)}
            strategy={horizontalListSortingStrategy}
          >
            <ul className="grid grid-cols-1 sm:flex sm:flex-wrap w-full mt-8 sm:mt-12 gap-2 sm:gap-8 xl:gap-1 min-[1920px]:gap-32  xl:animate-appear xl:[animation-timeline:view()] xl:animation-range-entry px-4 sm:px-0">
              {displayedCars.map((car) => (
                <SortableCarItem 
                  key={car.idXe} 
                  car={car}
                  category={getCategoryById(car.idLoaiXe)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 px-4 sm:px-0">
          <button
            onClick={loadMore}
            className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
          >
            Load more
          </button>
          <button
            onClick={showLess}
            className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
          >
            Show less
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;