"use client";
import React from 'react';
import Footer from '@/app/components/Footer';
import { ShoppingCart } from '@/app/components/Shoppingcart';


const CartPage = () => {
  return (
    <div className="w-full min-h-screen pt-24" data-theme="light">
      <div className="container mx-auto px-4">
        <ShoppingCart />
      </div>
      <Footer />
    </div>
  );
};
export default CartPage;