import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Award, RefreshCw } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';
import { mockProducts, mockCategories } from '../data/mockData';

export default function Home() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Simulate loading products
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
  }, [dispatch]);

  const featuredProducts = mockProducts.slice(0, 4);
  const newProducts = mockProducts.slice(2, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Premium 
                <span className="block text-purple-200">Products</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Explore our curated collection of high-quality products from trusted sellers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Shopping"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium quality products only</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover our carefully curated product categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked favorites from our collection
              </p>
            </div>
            <Link
              to="/products"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-xl text-gray-600">
                Fresh products just added to our store
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}