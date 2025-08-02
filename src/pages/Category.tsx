import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { mockProducts, mockCategories } from '../data/mockData';
import { Product } from '../types';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const category = mockCategories.find(cat => cat.slug === slug);

  useEffect(() => {
    if (category) {
      let filtered = mockProducts.filter(product => 
        product.category.toLowerCase() === category.name.toLowerCase()
      );

      // Filter by price range
      filtered = filtered.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [category, priceRange, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <Link
              to="/products"
              className="inline-flex items-center text-purple-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-purple-100 max-w-2xl">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {category.name} Products
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setPriceRange([0, 2000])}
                className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No products found</div>
                <p className="text-gray-600">Try adjusting your filters or browse other categories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}