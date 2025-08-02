import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useCart } from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p.id === id);
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-purple-600' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-purple-600">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex space-x-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                  {['Black', 'White', 'Gray', 'Navy'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedColor === color
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}