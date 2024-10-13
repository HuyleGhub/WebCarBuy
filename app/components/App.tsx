"use client"
import React, { useState } from 'react';
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

interface Car {
  id: string;
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
              <button className="btn btn-outline">Xem Chi Tiết</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const CarGallery = () => {
  const [cars, setCars] = useState<Car[]>([
    {
      id: 'ved40',
      title: 'VinFast Ved40 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/ClGFlnZ.png',
    },
    {
      id: 'vef70',
      title: 'VinFast Vef70 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/h5eZaj7.png', // Replace with actual image URL
    },
    {
      id: 'ves60',
      title: 'VinFast Ves60 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/h5eZaj7.png',
    },
    {
      id: 've50',
      title: 'VinFast Ve50 VF3',
      price: '320.000.000 Vnđ',
      imageUrl: 'https://i.imgur.com/IiQj1Dg.png',
    },
  ]);

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

  return (
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
  );
};

export default CarGallery;