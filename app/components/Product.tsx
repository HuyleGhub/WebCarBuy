"use client"
import React, { use, useState } from "react";
import Image from "next/image";
import vf3pink from "../images/vf3pink.png";
import vf3yellow from "../images/vf3yellow.png";
import vf3red from "../images/vf3red.png";
import vf3green from "../images/vf3green.png";
import vf6 from "../images/VF6.png";
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
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
import router from "next/router";
import { ParsedPath } from "path";
import Link from "next/link";
const Product = () => {
  const [isRunning,setRunning] = useState(false);
  
  interface Car {
    id: number;
    title: string;
    price: string;
    imageUrl: string;
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
    } = useSortable({ id: car.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div 
          className={`card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl relative ${
            isHovered ? "animate-borderrun" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute bg-gradient-to-bl from-blue-600 to-blue-400 w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl ${
            isHovered ? "animate-spinrun" : "hidden"
          }`}></div>
          <div className="w-[303px] h-[303px]">
            <figure className="px-10">
              <img
                src={car.imageUrl}
                alt={car.title}
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{car.title}</h2>
              <p>Giá xe: {car.price}</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <Link href={"/Carcategory"} className="btn btn-outline">Xem Chi Tiết</Link>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };
  const Cars: Car[] = [
    {
      id: 1,
      title: 'VinFast Ved40 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/ClGFlnZ.png',
    },
    {
      id: 2,
      title: 'VinFast Vef70 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/h5eZaj7.png', // Replace with actual image URL
    },
    {
      id: 3,
      title: 'VinFast Ves60 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/h5eZaj7.png',
    },
    {
      id: 4,
      title: 'VinFast Ve50 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/IiQj1Dg.png',
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCars((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
    const [cars, setCars] = useState(Cars);
  return (
    <div className="w-full h-full flex flex-col " data-theme="light">
       {/* title vf3 */}
      <div className="xl:mx-36 md:mx-10 mt-20 ">
        <span className="font-bold xl:text-5xl md:text-4xl text-3xl w-full text-slate-600 font-serif animate-appeartop 
        [animation-timeline:view()]  animation-range-entry ">
          Vf3
        </span>
        <br />
        <div className="border-b-4 border-blue-500 mt-5"> </div>
       {/* Card product list vf3 */}
        <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cars.map(car => car.id)}
        strategy={horizontalListSortingStrategy}
      >
        <ul className="flex w-full mt-12 min-[1530px]:gap-32 xl:gap-6 h-72 flex-wrap animate-appear [animation-timeline:view()] animation-range-entry list-none">
          {cars.map((car) => (
            <SortableCarItem key={car.id} car={car} />
          ))}
        </ul>
      </SortableContext>
    </DndContext> 
         {/* <div className="flex relative w-full mt-12 min-[1530px]:gap-32 xl:gap-6 flex-wrap animate-appear [animation-timeline:view()]  animation-range-entry">
          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl ">
            <figure className="px-10 ">
              <Image
                src={vf3pink}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Ved40 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <button className="btn btn-outline">Xem Chi Tiết</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
            <figure className="px-10 ">
            <Image
                src={vf3yellow}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Vef70 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <button className="btn btn-outline">Xem Chi Tiết</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
            <figure className="px-10 ">
            <Image
                src={vf3red}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Ves60 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <button className="btn btn-outline">Xem Chi Tiết</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
  <figure className="px-10">
    <Image
      src={car.HinhAnh}
      width={256}
      height={128}
      alt={car.TenXe}
      className="rounded-xl w-64 h-32"
    />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{car.TenXe}</h2>
    <p>Giá xe: {car.GiaXe}</p>
    <div className="card-actions">
      <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
      <button 
        className="btn btn-outline" 
        onClick={() => router.push(`api/xe/${car.id}`)}
      >
        Xem Chi Tiết
      </button>
    </div>
  </div>
</div>

        </div> */}
      </div>


      <div className="xl:mx-36 md:mx-10 mt-24 ">
        <span className="font-bold xl:text-5xl md:text-4xl text-3xl w-full  text-slate-600 font-serif animate-appeartop [animation-timeline:view()]  animation-range-entry ">
          Vf5 Plus
        </span>
        <br />
        <div className="border-b-4 border-blue-500 mt-5"></div>
       {/* Card product list vf5 plus */}
       <div className="flex relative w-full mt-12 min-[1530px]:gap-32 xl:gap-6 flex-wrap animate-appear [animation-timeline:view()]  animation-range-entry">
       <div className={`card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl relative ${isRunning ? "animate-borderrun" : "" }`}> 
            <div className={`absolute bg-gradient-to-bl from-blue-600 to-blue-400 w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl ${isRunning ? "animate-spinrun" : "hidden"}`}></div>
            <div className="w-[303px] h-[303px]" onMouseEnter={()=>setRunning(true)} onMouseLeave={()=>setRunning(false)}>
            <figure className="px-10 ">
              <Image
                src={vf3pink}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Ved40 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <Link href="/Carcategory" className="btn btn-outline">Xem Chi Tiết</Link>
              </div>
            </div>
          </div>
        </div>

          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
            <figure className="px-10 ">
            <Image
                src={vf3yellow}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Vef70 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <button className="btn btn-outline">Xem Chi Tiết</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
            <figure className="px-10 ">
            <Image
                src={vf3red}
                width={256}
                height={128}
                alt="Shoes"
                className="rounded-xl w-64 h-32"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">VinFast Ves60 VF3</h2>
              <p>Giá xe: 320.000.000 Vnđ</p>
              <div className="card-actions">
                <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                <button className="btn btn-outline">Xem Chi Tiết</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl">
  <figure className="px-10">
    <Image
      src={vf3pink}
      width={256}
      height={128}
      alt="car"
      className="rounded-xl w-64 h-32"
    />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Vf3Plus</h2>
    <p>Giá xe: 3000000000</p>
    <div className="card-actions">
      <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
      <button 
        className="btn btn-outline" 
      >
        Xem Chi Tiết
      </button>
    </div>
  </div>
</div>

        </div>
         
       {/* <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="carGallery" direction="horizontal">
    {(provided) => (
      <ul
        className="flex w-full mt-12 min-[1530px]:gap-32 xl:gap-6 h-72 flex-wrap animate-appear [animation-timeline:view()] animation-range-entry list-none"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {cars.map(({id, title, price, imageUrl}, index) => (
          <Draggable key={id} draggableId={id.toString()} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="mb-8 relative"
              >
                <div 
                  className={`card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 shadow-xl relative ${
                    hoveredCard === id.toString() ? "animate-borderrun" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(id.toString())}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute bg-gradient-to-bl from-blue-600 to-blue-400 w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl ${
                    hoveredCard === id.toString() ? "animate-spinrun" : "hidden"
                  }`}></div>
                  <div className="w-[303px] h-[303px]">
                    <figure className="px-10">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="rounded-xl w-64 h-32"
                      />
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title">{title}</h2>
                      <p>Giá xe: {price}</p>
                      <div className="card-actions">
                        <button className="btn bg-[#1464F4] text-white">Đặt Cọc</button>
                        <button className="btn btn-outline">Xem Chi Tiết</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext> */}
        </div>
      </div>
  
  );
};

export default Product;
