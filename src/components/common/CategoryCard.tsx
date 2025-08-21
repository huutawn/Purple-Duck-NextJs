'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CategoryCardProps = {
  category: {
    id: number;
    name: string;
    description: string;
    image: string;
    displayOrder?: number;
  };
  className?: string;
};

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.id}`}
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 block ${className}`}
    >
      <div className="relative">
        <Image
          src={category.image}
          alt={category.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h3 className="text-xl font-semibold mb-2 group-hover:scale-105 transition-transform duration-300">
              {category.name}
            </h3>
            <p className="text-sm opacity-90 line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
