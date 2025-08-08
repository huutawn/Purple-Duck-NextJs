'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, Share2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product, ProductVariant } from '@/app/types/product';
import { GetByProductId } from '@/app/Service/products';
import toast, { Toaster } from 'react-hot-toast'; // Vẫn import để xử lý thông báo

export default function ProductDetail() {
  const params = useParams();
  const rawIdFromParams = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const router = useRouter();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      if (!rawIdFromParams || typeof rawIdFromParams !== 'string') {
        setError("ID sản phẩm không hợp lệ hoặc không được cung cấp.");
        setLoading(false);
        return;
      }

      const productIdNum = parseInt(rawIdFromParams);
      if (isNaN(productIdNum)) {
        setError("ID sản phẩm không phải là số hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const res = await GetByProductId(productIdNum);
        console.log('Product Detail API Response:', res);

        if (res.code === 1000 && res.result) {
          const fetchedProduct: Product = res.result;
          setProduct(fetchedProduct);

          if (fetchedProduct.productVariants && fetchedProduct.productVariants.length > 0) {
            const defaultVariant = fetchedProduct.productVariants.find(v => v.stock > 0) || fetchedProduct.productVariants[0];
            setSelectedVariant(defaultVariant);

            const initialAttrs: { [key: string]: string } = {};
            defaultVariant.attributes.forEach(attr => {
              if (attr.attributeValue && attr.attributeValue.length > 0) {
                initialAttrs[attr.attributeName] = attr.attributeValue[0].value;
              }
            });
            setSelectedAttributes(initialAttrs);
          } else {
            setError("Sản phẩm này không có biến thể nào.");
          }
        } else {
          setError(res.message || "Không thể tải chi tiết sản phẩm.");
        }
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Lỗi khi tải chi tiết sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [rawIdFromParams]);

  const handleAttributeChange = useCallback((attributeName: string, value: string) => {
    setError(null);
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  }, []);

  useEffect(() => {
    if (!product) return;

    const matchedVariant = product.productVariants.find(variant => {
      const allSelectedAttrsMatch = Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
        const variantAttr = variant.attributes.find(a => a.attributeName === attrName);
        return variantAttr && variantAttr.attributeValue.some(av => av.value === attrValue);
      });
      const requiredAttributeNames = Array.from(new Set(product.productVariants.flatMap(v => v.attributes.map(a => a.attributeName))));
      const allRequiredAttributesSelected = requiredAttributeNames.every(name => selectedAttributes[name] !== undefined && selectedAttributes[name] !== '');

      return allSelectedAttrsMatch && allRequiredAttributesSelected;
    });

    setSelectedVariant(matchedVariant || null);
    setQuantity(1);
  }, [selectedAttributes, product]);

  const uniqueProductImages = useMemo(() => {
    if (!product) return [];
    const allImages = [
      ...(product.coverImage ? [{ imageUrl: product.coverImage, type: 'cover' }] : []),
      ...(product.images || []).map(img => ({ imageUrl: img.imageUrl, type: 'product' })),
      ...(product.productVariants || [])
        .filter(variant =>
          variant.image &&
          !product.images?.some(img => img.imageUrl === variant.image) &&
          variant.image !== product.coverImage
        )
        .map(variant => ({ imageUrl: variant.image, type: 'variant' })),
    ];
    const uniqueMap = new Map<string, { imageUrl: string; type: string }>();
    allImages.forEach(item => {
      if (!uniqueMap.has(item.imageUrl) ||
        (uniqueMap.get(item.imageUrl)?.type === 'variant' && (item.type === 'cover' || item.type === 'product')) ||
        (uniqueMap.get(item.imageUrl)?.type === 'product' && item.type === 'cover')
      ) {
        uniqueMap.set(item.imageUrl, item);
      }
    });
    return Array.from(uniqueMap.values());
  }, [product]);

  useEffect(() => {
    if (selectedVariant?.image) {
      const index = uniqueProductImages.findIndex(img => img.imageUrl === selectedVariant.image);
      if (index !== -1) {
        setSelectedImageIndex(index);
      } else {
        setSelectedImageIndex(0);
      }
    } else {
      setSelectedImageIndex(0);
    }
  }, [selectedVariant, uniqueProductImages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Đang tải sản phẩm...</h2>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi: {error}</h2>
          <p className="text-gray-600">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600">Sản phẩm bạn tìm kiếm không tồn tại hoặc có lỗi.</p>
        </div>
      </div>
    );
  }

  const mainDisplayImage = selectedVariant?.image || product.coverImage || uniqueProductImages[selectedImageIndex]?.imageUrl || '/placeholder.png';
  const discountPercentage = 0;
  const displayPrice = selectedVariant ? selectedVariant.price : (product.productVariants[0]?.price || 0);
  const displayOriginalPrice = 0;
  const displayStock = selectedVariant ? selectedVariant.stock : (product.productVariants[0]?.stock || 0);
  const totalReviews = product.purchase ?? 0;
  const fixedRating = 5;

  const handleAction = async (action: 'add' | 'buy') => {
    setError(null);
    if (!selectedVariant) {
      toast.error("Vui lòng chọn một biến thể sản phẩm.");
      return;
    }
    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0.");
      return;
    }
    if (displayStock === 0) {
      toast.error("Sản phẩm đã hết hàng.");
      return;
    }
    if (quantity > displayStock) {
      toast.error(`Số lượng yêu cầu vượt quá số lượng tồn kho (${displayStock}).`);
      return;
    }
    const requiredAttributeNames = Array.from(new Set(product.productVariants.flatMap(v => v.attributes.map(a => a.attributeName))));
    const allRequiredAttributesSelected = requiredAttributeNames.every(name => selectedAttributes[name] !== undefined && selectedAttributes[name] !== '');
    if (!allRequiredAttributesSelected) {
      toast.error("Vui lòng chọn đầy đủ các thuộc tính của sản phẩm.");
      return;
    }
    const attributeValueIds: number[] = selectedVariant.attributes.flatMap(attr =>
      attr.attributeValue.map(val => val.attributeValueId)
    );
    if (attributeValueIds.length === 0 && selectedVariant.attributes.length > 0) {
      toast.error("Không thể thêm vào giỏ hàng: Thiếu thông tin thuộc tính biến thể.");
      return;
    }

    try {
      await addToCart(product, quantity, selectedVariant.id, attributeValueIds);
      toast.success(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng thành công!`, { position: 'top-right' });
      if (action === 'buy') {
        router.push('/checkout');
      }
    } catch (err: any) {
      console.error("Lỗi khi thực hiện hành động giỏ hàng:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng.", { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right"  />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Ảnh sản phẩm */}
            <div>
              <div className="mb-4 relative">
                <Image
                  src={mainDisplayImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-cover rounded-lg"
                  priority
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {uniqueProductImages.map((image, index) => (
                  <button
                    key={image.imageUrl}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < fixedRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {fixedRating.toFixed(1)} ({totalReviews} lượt mua)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-purple-600">${displayPrice.toFixed(2)}</span>
                {displayOriginalPrice > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${displayOriginalPrice.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Tiết kiệm {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.metaDescription || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </p>

              {error && (
                <div className="text-red-600 text-sm mb-4 p-2 border border-red-300 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {product.productVariants && product.productVariants.length > 0 && Array.from(new Set(product.productVariants.flatMap(v => v.attributes.map(a => a.attributeName))))
                .map(attrName => (
                  <div key={attrName} className="mb-6">
                    <h3 className="font-medium mb-3 capitalize">{attrName}</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(
                          product.productVariants
                          .flatMap(v => v.attributes)
                          .filter(attr => attr.attributeName === attrName)
                          .flatMap(attr => attr.attributeValue.map(av => av.value))
                        )).map((attrValue) => (
                          <button
                            key={attrValue}
                            onClick={() => handleAttributeChange(attrName, attrValue)}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              selectedAttributes[attrName] === attrValue
                                ? 'border-purple-600 bg-purple-50 text-purple-600'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {attrValue}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}

              {/* Lựa chọn số lượng */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Số lượng</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={quantity >= displayStock || displayStock === 0}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500 ml-4">
                    {displayStock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Các nút hành động */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={() => handleAction('add')}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  disabled={!selectedVariant || displayStock === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={() => handleAction('buy')}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  disabled={!selectedVariant || displayStock === 0}
                >
                  <span>Mua ngay</span>
                </button>
              </div>

              {/* Các tính năng sản phẩm */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t pt-6">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <span>Giao hàng miễn phí</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span>Trả hàng dễ dàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Các tab sản phẩm */}
          <div className="border-t">
            <div className="flex border-b">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'description' && 'Mô tả'}
                  {tab === 'specifications' && 'Thông số kỹ thuật'}
                  {tab === 'reviews' && 'Đánh giá'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium mb-4">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.metaDescription || product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Thông số kỹ thuật</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Thương hiệu:</span>
                        <span>{product.sellerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Danh mục:</span>
                        <span>{product.categoryName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Mã sản phẩm (SKU):</span>
                        <span>{selectedVariant?.sku || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedVariant?.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium capitalize">{attr.attributeName}:</span>
                          <span>{attr.attributeValue[0]?.value || 'N/A'}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span className="font-medium">Bảo hành:</span>
                        <span>{product.warrantyInfo || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Đánh giá của khách hàng</h3>
                  {totalReviews > 0 ? (
                    <div className="space-y-6">
                      <p className="text-gray-600">Sản phẩm này có {totalReviews} lượt mua.</p>
                      <p className="text-gray-600 italic">Tính năng xem đánh giá chi tiết sẽ sớm ra mắt!</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Sản phẩm này chưa có lượt mua nào.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}