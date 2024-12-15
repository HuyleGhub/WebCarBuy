"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import vf3red from "../images/vf3red.png";
// import vf6 from "../images/VF6.png";
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
  loaiXe: {
    TenLoai: string;
    NhanHieu: string;
  };
}

interface SortableCarItemProps {
  car: Car;
}

const SortableCarItem = ({ car }: SortableCarItemProps) => {
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
        className={`card bg-base-100 xl:w-72 xl:h-80 w-full md:w-72 md:h-80 ml-6 mb-5 shadow-xl relative ${
          isHovered ? "animate-borderrun" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute bg-gradient-to-bl from-orange-600 to-orange-400 w-[303px] h-[335px] z-[-1] -top-2 -left-2 rounded-2xl ${
            isHovered ? "animate-spinrun" : "hidden"
          }`}
        ></div>
        <div className="w-[303px] h-[303px]">
          <figure className="px-10">
            <Image
              src={
                Array.isArray(car.HinhAnh)
                  ? car.HinhAnh[0] // Nếu là mảng thì lấy ảnh đầu tiên
                  : car.HinhAnh.split("|")[0] // Nếu là chuỗi thì split và lấy phần tử đầu
              }
              alt={car.TenXe}
              width={100}
              height={100}
              className="rounded-xl w-64 h-32"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{car.TenXe}</h2>
            <p>
              Giá Xe:{" "}
              <span className="text-purple-600 font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(car.GiaXe)}
              </span>
            </p>
            <div className="card-actions">
              <button className="btn bg-[#1464F4] text-white">
                <Link href={`Datcoc?id=${car.idXe}`}>Đặt Cọc</Link>
                </button>
              <Link
                href={`Carcategory?id=${car.idXe}`}
                className="btn btn-outline"
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const carsPerPage = 4;

  useEffect(() => {
    fetch('/api/xe')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setCars(data);
        setDisplayedCars(data.slice(0, carsPerPage));
        setLoading(false);
      })
      .catch(e => {
        console.error("Có lỗi khi tải dữ liệu xe:", e);
        setError("Không thể tải dữ liệu xe. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen" data-theme = 'light'>
      <div className="loading loading-spinner text-blue-600 loading-lg"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen" data-theme = 'light'>
      <div className="text-2xl font-bold text-red-600">{error}</div>
    </div>;
  }
  const loadMore  = () => {
    const currentLength = displayedCars.length;
    const newCars = cars.slice(currentLength, currentLength + carsPerPage);
    setDisplayedCars(prevCars => [...prevCars, ...newCars]);
    }
  const showLess = () => {
    setDisplayedCars(displayedCars.slice(0, carsPerPage));
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCars((items) => {
        const oldIndex = items.findIndex((item) => item.idXe === active.id);
        const newIndex = items.findIndex((item) => item.idXe === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  

  return (
    <div className="w-full h-full flex flex-col " data-theme="light">
      <div className="xl:mx-28 md:mx-10 mt-24 ">
        <span className="font-bold xl:text-5xl md:text-4xl text-3xl w-full text-slate-600 font-serif animate-appeartop 
        [animation-timeline:view()]  animation-range-entry ">
          Danh sách xe
        </span>
        <br />
        <div className="border-b-4 border-blue-500 mt-5"> </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayedCars.map(car => car.idXe)}
            strategy={horizontalListSortingStrategy}
          >
            <ul className="flex w-full mt-12 min-[1536px]:gap-2 min-[1920px]:gap-32  xl:gap-8 xl:h-full h-full flex-wrap animate-appear [animation-timeline:view()] animation-range-entry list-none">
              {displayedCars.map((car) => (
                <SortableCarItem key={car.idXe} car={car} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        <div className="flex justify-center gap-5">
          <div className="flex justify-center mt-8">
            <button 
              onClick={loadMore} 
              className="btn bg-blue-500 text-white hover:bg-blue-600"
            >
              Load more
            </button>
          </div>
          <div className="flex justify-center mt-8">
            <button 
              onClick={showLess} 
              className="btn bg-blue-500 text-white hover:bg-blue-600"
            >
              Show less
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Product;