"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  Award,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { GetAllCategory } from "@/app/Service/Category";
import { GetTop5MostPurchase, GetTop5New } from "@/app/Service/products";

import { Product, ProductVariant } from "@/app/types/product";

type CategoryForHome = {
  id: number;
  name: string;
  description: string; // Loại bỏ slug vì không có
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryForHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoriesSectionRef = useRef<HTMLDivElement>(null);

  // Logic carousel cho danh mục
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0); // Index danh mục hiện tại
  const categoriesPerPage = 4; // Số danh mục hiển thị cùng lúc

  const handleNextCategory = () => {
    setCurrentCategoryIndex((prev) =>
      prev + 1 >= Math.ceil(categories.length / categoriesPerPage)
        ? 0
        : prev + 1
    );
  };

  const handlePrevCategory = () => {
    setCurrentCategoryIndex((prev) =>
      prev - 1 < 0
        ? Math.ceil(categories.length / categoriesPerPage) - 1
        : prev - 1
    );
  };

  const processProductData = (products: any[]): Product[] => {
    return products.map((product) => {
      const categoryFound = categories.find((cat) => cat.id === product.categoryId);
      const categoryName = categoryFound ? categoryFound.name : "Không xác định";

      return {
        id: product.id,
        categoryId: product.categoryId,
        categoryName: categoryName,
        sellerId: product.sellerId,
        name: product.name,
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, "-"),
        coverImage:
          product.coverImage ||
          (product.images && product.images.length > 0
            ? product.images[0].imageUrl
            : "/placeholder.png"),
        images: product.images,
        metaTitle: product.metaTitle || null,
        purchase: product.purchase ?? 0,
        metaDescription: product.metaDescription || null,
        warrantyInfo: product.warrantyInfo || "",
        createdAt: product.createdAt,
        productVariants: product.productVariants,
        active: product.active,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryRes = await GetAllCategory();
        console.log("Category Response:", categoryRes); // Debug dữ liệu từ API
        let fetchedCategories: CategoryForHome[] = [];

        if (categoryRes.data.code === 1000 && Array.isArray(categoryRes.data.result)) {
          fetchedCategories = categoryRes.data.result.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description || `Khám phá sản phẩm trong danh mục ${cat.name}`,
          }));
          if (fetchedCategories.length === 0) {
            throw new Error("Không có danh mục nào được trả về từ API.");
          }
        } else {
          console.warn("API GetAllCategory didn't return expected data or format:", categoryRes);
          throw new Error(categoryRes.data.message || "Lỗi khi tải danh mục.");
        }
        setCategories(fetchedCategories);

        const topPurchaseRes = await GetTop5MostPurchase();
        if (topPurchaseRes.code === 1000 && Array.isArray(topPurchaseRes.result?.data)) {
          setFeaturedProducts(processProductData(topPurchaseRes.result.data));
        } else {
          console.warn("API GetTop5MostPurchase didn't return expected data or format:", topPurchaseRes);
          throw new Error(topPurchaseRes.message || "Lỗi khi tải sản phẩm nổi bật.");
        }

        const topNewRes = await GetTop5New();
        if (topNewRes.code === 1000 && Array.isArray(topNewRes.result?.data)) {
          setNewProducts(processProductData(topNewRes.result.data));
        } else {
          console.warn("API GetTop5New didn't return expected data or format:", topNewRes);
          throw new Error(topNewRes.message || "Lỗi khi tải sản phẩm mới.");
        }
      } catch (err: any) {
        console.error("Error fetching data for Home page:", err);
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setFeaturedProducts([]);
        setNewProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToCategories = () => {
    if (categoriesSectionRef.current) {
      categoriesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Tính toán danh mục hiển thị
  const visibleCategories = categories.slice(
    currentCategoryIndex * categoriesPerPage,
    (currentCategoryIndex + 1) * categoriesPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phần Hero (giữ nguyên) */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Khám Phá Sản Phẩm
                <span className="block text-purple-200">Cao Cấp</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Khám phá bộ sưu tập được tuyển chọn kỹ lưỡng của chúng tôi với các sản phẩm chất lượng cao từ các nhà bán hàng đáng tin cậy trên toàn thế giới.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Mua Ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button
                  onClick={scrollToCategories}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Duyệt Danh Mục
                </button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mua sắm"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Phần Tính Năng (giữ nguyên) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Giao Hàng Miễn Phí</h3>
              <p className="text-gray-600">Giao hàng miễn phí cho đơn hàng trên 1.200.000 VNĐ</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Thanh Toán An Toàn</h3>
              <p className="text-gray-600">Thông tin thanh toán của bạn được bảo mật</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Chất Lượng Đảm Bảo</h3>
              <p className="text-gray-600">Chỉ cung cấp sản phẩm chất lượng cao</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trả Hàng Dễ Dàng</h3>
              <p className="text-gray-600">Chính sách trả hàng trong 30 ngày</p>
            </div>
          </div>
        </div>
      </section>


      {/* Phần Sản Phẩm Nổi Bật */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-xl text-gray-600">
                Những sản phẩm yêu thích được chọn lọc từ bộ sưu tập của chúng tôi
              </p>
            </div>
            <Link
              href="/products"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              Xem Tất Cả
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="col-span-full text-center text-gray-500">Đang tải sản phẩm nổi bật...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">{error}</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm nổi bật nào.</div>
          )}
        </div>
      </section>

      {/* Phần Sản Phẩm Mới */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản Phẩm Mới
              </h2>
              <p className="text-xl text-gray-600">
                Các sản phẩm mới vừa được thêm vào cửa hàng của chúng tôi
              </p>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              Xem Tất Cả
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="col-span-full text-center text-gray-500">Đang tải sản phẩm mới...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">{error}</div>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm mới nào.</div>
          )}
        </div>
      </section>
    </div>
  );
}