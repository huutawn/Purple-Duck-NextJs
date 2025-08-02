import { Product, User, Category } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Electronics',
    stock: 50,
    rating: 4.8,
    reviews: 234,
    sellerId: 'seller1',
    tags: ['wireless', 'headphones', 'audio', 'premium'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Luxury Watch Collection',
    description: 'Elegant timepiece with premium materials and sophisticated design.',
    price: 899.99,
    originalPrice: 1299.99,
    images: [
      'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1159733/pexels-photo-1159733.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Accessories',
    stock: 25,
    rating: 4.9,
    reviews: 89,
    sellerId: 'seller2',
    tags: ['luxury', 'watch', 'timepiece', 'elegant'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Designer Handbag',
    description: 'Crafted from premium leather with attention to detail and style.',
    price: 459.99,
    originalPrice: 599.99,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Fashion',
    stock: 30,
    rating: 4.7,
    reviews: 156,
    sellerId: 'seller3',
    tags: ['handbag', 'leather', 'designer', 'fashion'],
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracking with heart rate monitoring and smartphone integration.',
    price: 199.99,
    originalPrice: 249.99,
    images: [
      'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1694380/pexels-photo-1694380.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Electronics',
    stock: 75,
    rating: 4.6,
    reviews: 312,
    sellerId: 'seller1',
    tags: ['fitness', 'tracker', 'smart', 'health'],
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    name: 'Organic Skincare Set',
    description: 'Natural skincare products made with organic ingredients for healthy skin.',
    price: 129.99,
    originalPrice: 179.99,
    images: [
      'https://images.pexels.com/photos/3622650/pexels-photo-3622650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3622651/pexels-photo-3622651.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Beauty',
    stock: 40,
    rating: 4.8,
    reviews: 203,
    sellerId: 'seller4',
    tags: ['skincare', 'organic', 'natural', 'beauty'],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '6',
    name: 'Professional Camera Lens',
    description: 'High-quality lens for professional photography with superior optics.',
    price: 1299.99,
    originalPrice: 1599.99,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/90317/pexels-photo-90317.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Electronics',
    stock: 15,
    rating: 4.9,
    reviews: 67,
    sellerId: 'seller5',
    tags: ['camera', 'lens', 'photography', 'professional'],
    createdAt: new Date('2024-01-20'),
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare and beauty products',
    image: 'https://images.pexels.com/photos/3622650/pexels-photo-3622650.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Premium accessories and jewelry',
    image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  role: 'buyer',
  avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  createdAt: new Date('2024-01-01'),
};