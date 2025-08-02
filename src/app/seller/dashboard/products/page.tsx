"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, TrendingUp, AlertTriangle, Package, Star, Edit, Eye, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Nếu dùng Heroicons thay vì lucide-react

import AddProductModal from '@/app/seller/component/AddProductModal'; // Import modal
import { GetAllProductsMySeller } from '@/app/Service/products';
import { GetAllCategory } from '@/app/Service/Category';

type ProductVariant = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  attributes: {
    attributeId: number;
    attributeName: string;
    attributeValue: { attributeValueId: number; value: string; displayValue: string }[];
  }[];
};

type Product = {
  id: number;
  categoryId: number;
  categoryName?: string; // THÊM DÒNG NÀY: Để lưu trữ tên danh mục
  sellerId: number;
  name: string;
  slug: string;
  coverImage: string;
  images: { id: number; productId: number; variantId: number | null; imageUrl: string; displayOrder: number; createdAt: string }[];
  metaTitle: string | null;
  purchase: number | null;
  metaDescription: string | null;
  warrantyInfo: string;
  createdAt: string;
  productVariants: ProductVariant[];
  active: boolean;
};

type ProductsResponse = {
  code: number;
  result: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: Product[];
  };
};

// Định nghĩa kiểu cho Category item, thêm 'id: "all"' cho tùy chọn "Tất Cả Danh Mục"
type CategoryOption = { id: number | 'all'; name: string };

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // State cho danh mục đã chọn (Headless UI)
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>({ id: 'all', name: 'Tất Cả Danh Mục' });


  // Lấy danh sách sản phẩm và danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Calling API with page=${page}, size=${size}`);

        // 1. Lấy danh sách danh mục trước
        const categoriesRes = await GetAllCategory();
        let fetchedCategories: CategoryOption[] = [{ id: 'all', name: 'Tất Cả Danh Mục' }];

        if (categoriesRes.data && Array.isArray(categoriesRes.data.result)) {
            // Chỉ thêm các danh mục hợp lệ, không bao gồm 'all' lần nữa
            fetchedCategories = [...fetchedCategories, ...categoriesRes.data.result.map(cat => ({id: cat.id, name: cat.name}))];
        } else {
            console.warn("Dữ liệu danh mục không đúng định dạng:", categoriesRes);
        }
        setCategories(fetchedCategories); // Cập nhật state danh mục

        // 2. Lấy danh sách sản phẩm
        const params = { page, size };
        const productsRes = await GetAllProductsMySeller(params);
        setTotalElements(productsRes.result.totalElements);

        // 3. Gán categoryName vào từng sản phẩm
        const productsWithCategoryName: Product[] = productsRes.result.data.map(product => {
          const categoryFound = fetchedCategories.find(cat => cat.id === product.categoryId);
          return {
            ...product,
            categoryName: categoryFound ? categoryFound.name : 'Không xác định' // Gán tên danh mục
          };
        });
        setProducts(productsWithCategoryName); // Cập nhật state sản phẩm đã có tên danh mục

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        // Xử lý lỗi: ví dụ, xóa cookie và chuyển hướng về trang đăng nhập nếu là lỗi 401
        // (Đã có trong axios interceptor, nhưng có thể thêm logic ở đây nếu cần phản hồi UI cụ thể)
      }
    };
    fetchData();
  }, [page, size]); // Chỉ chạy khi page hoặc size thay đổi

  const getStatusColor = (stock: number) => {
    if (stock === 0) return 'text-red-400 bg-red-400/20';
    if (stock <= 10) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-green-400 bg-green-400/20';
  };

  const getStatusIcon = (stock: number) => {
    if (stock === 0) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (stock <= 10) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <Package className="w-4 h-4 text-green-400" />;
  };

  // Tính toán chỉ số thống kê
  const totalProducts = totalElements;
  const activeProducts = products.filter(p => p.active).length;
  // TODO: Cần tính toán lowStockProducts và outOfStockProducts dựa trên dữ liệu hiện tại
  // Logic này cần lặp qua tất cả productVariants của mỗi sản phẩm
  const lowStockProducts = products.filter(p => p.productVariants.some(v => v.stock > 0 && v.stock <= 10)).length;
  const outOfStockProducts = products.filter(p => p.productVariants.every(v => v.stock === 0)).length;


  // Lọc sản phẩm
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.toString().toLowerCase().includes(searchTerm.toLowerCase());

    // SỬ DỤNG TRỰC TIẾP product.categoryName để lọc
    const matchesCategory = selectedCategory.id === 'all' ||
                            (product.categoryName && product.categoryName.toLowerCase() === selectedCategory.name.toLowerCase());

    return matchesSearch && matchesCategory;
  }).map(product => ({
    ...product,
    price: `$${Math.min(...product.productVariants.map(v => v.price)).toFixed(2)}`,
    stock: Math.max(...product.productVariants.map(v => v.stock)), // Lấy stock lớn nhất cho hiển thị tổng quan
    sold: product.purchase ?? 0,
    variants: product.productVariants.length,
    image: product.coverImage || product.images[0]?.imageUrl || '',
  }));


  // Memoize các hàm xử lý
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalElements / size)) {
      setPage(newPage);
    }
  }, [totalElements, size]);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1); // Quay về trang 1 khi thay đổi kích thước trang
  }, []);

  // Hàm xử lý khi chọn danh mục từ Headless UI Listbox
  const handleCategorySelect = useCallback((category: CategoryOption) => {
    setSelectedCategory(category);
    // Reset về trang 1 khi thay đổi bộ lọc
    setPage(1);
  }, []);


  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Sản Phẩm</h1>
          <p className="text-gray-300 mt-1">Quản lý kho sản phẩm của bạn</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Sản Phẩm Hoạt Động</p>
              <p className="text-2xl font-bold text-white">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Hàng Tồn Thấp</p>
              <p className="text-2xl font-bold text-white">{lowStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Hết Hàng</p>
              <p className="text-2xl font-bold text-white">{outOfStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* === PHẦN HEADLESS UI LISTBOX CHO DANH MỤC === */}
          <Listbox value={selectedCategory} onChange={handleCategorySelect}>
            <div className="relative w-full sm:w-auto">
              <ListboxButton className="relative w-full cursor-default rounded-xl bg-white/10 py-3 pl-4 pr-10 text-left text-white shadow-md border border-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                <span className="block truncate">{selectedCategory.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {categories.map((cat) => (
                  <ListboxOption
                    key={cat.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        active ? 'bg-purple-600 text-white' : 'text-gray-300'
                      }`
                    }
                    value={cat}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {cat.name}
                        </span>
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          {/* === HẾT PHẦN HEADLESS UI LISTBOX === */}

        </div>
      </div>

      {/* Lưới sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex items-center space-x-2">
                  {getStatusIcon(product.stock)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.stock)}`}>
                    {product.stock === 0 ? 'hết hàng' : product.stock <= 10 ? 'hàng tồn thấp' : 'hoạt động'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.id}</p>
                  {/* HIỂN THỊ TÊN DANH MỤC */}
                  {product.categoryName && (
                      <p className="text-gray-400 text-xs mt-1">Danh mục: {product.categoryName}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Tồn kho</p>
                    <p className="text-white font-medium">{product.stock} đơn vị</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Đã bán</p>
                    <p className="text-white font-medium">{product.sold}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Biến thể</p>
                    <p className="text-white font-medium">{product.variants}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-purple-500/20">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <select
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white">
            Trang {page} / {Math.ceil(totalElements / size) || 1}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === Math.ceil(totalElements / size) || totalElements === 0}
            className="px-3 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal thêm sản phẩm */}
      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default ProductsPage;