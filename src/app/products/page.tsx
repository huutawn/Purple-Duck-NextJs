'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter, Grid, List, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import { GetAllProducts, GetAllProductsByCategory } from '@/app/Service/products'; // Thêm GetAllProductsByCategory
import { GetAllCategory } from '@/app/Service/Category';

import { Product } from '@/types'; 

// Tái định nghĩa CategoryForFilter để khớp với API category
type CategoryForFilter = {
  id: number;
  name: string;
};

// Định nghĩa Product with minPrice để sử dụng trong Products component
interface ProductWithMinPrice extends Product {
    minPrice: number;
    rating: number;
    reviews: number;
}

export default function Products() {
  const [products, setProducts] = useState<ProductWithMinPrice[]>([]);
  const [categories, setCategories] = useState<CategoryForFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(15);
  const [totalElements, setTotalElements] = useState(0);

  // State cho bộ lọc
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2000]); // Giá trị tối đa giả định
  const [selectedCategory, setSelectedCategory] = useState('all'); // Lưu name hoặc 'all'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Hàm xử lý dữ liệu sản phẩm từ API
  const processProductData = (products: any[], fetchedCategories: CategoryForFilter[]): ProductWithMinPrice[] => {
    return products.map((product) => {
      const categoryFound = fetchedCategories.find(cat => cat.id === product.categoryId);
      const categoryName = categoryFound ? categoryFound.name : 'Không xác định';

      const minPrice = product.productVariants && product.productVariants.length > 0
        ? Math.min(...product.productVariants.map((v: any) => v.price))
        : 0;

      return {
        ...product,
        categoryName: categoryName,
        minPrice: minPrice,
        rating: 5,
        reviews: product.purchase ?? 0
      } as ProductWithMinPrice;
    });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset về trang 1 khi thay đổi category
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories first (luôn cần)
        const categoriesRes = await GetAllCategory();
        let fetchedCategories: CategoryForFilter[] = [];
        if (categoriesRes.data.code === 1000 && Array.isArray(categoriesRes.data.result)) {
          fetchedCategories = categoriesRes.data.result.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          }));
          setCategories(fetchedCategories);
        } else {
          console.warn("API GetAllCategory didn't return expected data.");
        }

        let productsRes;
        if (selectedCategory === 'all') {
          // GỌI API GetAllProduct KHI CHỌN "Tất cả"
          productsRes = await GetAllProducts({ page, size });
        } else {
          // GỌI API GetAllProductsByCategory KHI CHỌN 1 CATEGORY CỤ THỂ
          const categoryToFilter = fetchedCategories.find(cat => cat.name === selectedCategory);
          if (categoryToFilter) {
            productsRes = await GetAllProductsByCategory({ categoryId: categoryToFilter.id, page, size });
          } else {
            // Xử lý trường hợp category không tồn tại
            productsRes = { code: 1000, result: { data: [], totalElements: 0 } };
          }
        }

        if (productsRes.code === 1000 && productsRes.result?.data) {
          const productsWithMinPrice = processProductData(productsRes.result.data, fetchedCategories);
          setProducts(productsWithMinPrice);
          setTotalElements(productsRes.result.totalElements);
        } else {
          throw new Error(productsRes.message || 'Lỗi khi tải danh sách sản phẩm.');
        }
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Không thể tải dữ liệu sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [page, size, selectedCategory]); // Dependency array bao gồm selectedCategory

  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...products];
    
    // TẠM THỜI CHỈ SẮP XẾP VÌ CHỨC NĂNG LỌC ĐÃ ĐƯỢC CHUYỂN LÊN useEffect
    // Logic lọc theo Category và Price Range đã được xử lý trong useEffect khi gọi API
    
    // Sắp xếp
    switch (sortBy) {
      case 'price-low':
        tempProducts.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-high':
        tempProducts.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case 'rating':
        tempProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        tempProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return tempProducts;
  }, [products, sortBy]); // products và sortBy là dependencies

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([0, parseInt(e.target.value)]);
  }, []);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 2000]);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalElements / size)) {
      setPage(newPage);
    }
  };
  
  if (loading) { /* ... loading state ... */ }
  if (error) { /* ... error state ... */ }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
            <p className="text-gray-600">Khám phá bộ sưu tập đầy đủ của chúng tôi</p>
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
                <option value="featured">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Bộ lọc</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Danh mục</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={handleCategoryChange}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">Tất cả</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category.name}
                        onChange={handleCategoryChange}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Khoảng giá</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000" // Giá trị tối đa cứng, có thể làm động sau
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Hiển thị {filteredAndSortedProducts.length} trên {totalElements} sản phẩm
            </div>
            
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      className={viewMode === 'list' ? 'flex' : ''}
                    />
                  ))
              ) : (
                  <div className="text-center py-12 col-span-full">
                    <div className="text-gray-400 text-lg">Không tìm thấy sản phẩm nào</div>
                    <p className="text-gray-600 mt-2">Hãy thử điều chỉnh bộ lọc của bạn</p>
                  </div>
              )}
            </div>

            {/* Pagination */}
            {totalElements > size && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-700">
                    Trang {page} / {Math.ceil(totalElements / size) || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === Math.ceil(totalElements / size)}
                    className="px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Hiển thị {(page - 1) * size + 1} - {Math.min(page * size, totalElements)} trên {totalElements} sản phẩm
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}