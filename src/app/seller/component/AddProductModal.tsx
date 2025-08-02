"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Thêm useCallback
import { X, Plus, Trash2, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react'; // Thêm ChevronDown
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'; // Import Headless UI components
// import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Nếu dùng Heroicons

import { upload } from '@/app/Service/File';
import { GetAllCategory } from '@/app/Service/Category';
import { createProduct } from '@/app/Service/products';

// Thay interface bằng type
type VariantAttribute = {
  name: string;
  value: string;
};

type Variant = {
  id: string; // Sử dụng string cho ID để dễ dàng quản lý với Date.now().toString()
  sku: string;
  price: string;
  quantity: string;
  attributes: VariantAttribute[];
  images: string[]; // Mảng URL hình ảnh sau khi upload
};

type Category = {
  id: number;
  name: string;
};

// Định nghĩa kiểu cho CategoryOption, bao gồm tùy chọn "Chọn Danh Mục"
type CategoryOption = {
  id: number | ''; // ID có thể là number hoặc rỗng cho tùy chọn ban đầu
  name: string;
};

type ProductInfo = {
  name: string;
  description: string;
  slug: string;
  title: string;
  productDescription: string;
  categoryId: number | null; // Sửa từ 'category: string' sang 'categoryId: number | null'
  productImages: string[]; // Mảng nhiều ảnh
  coverImage: string; // Một ảnh bìa
  warrantyInfo: string;
};

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryOption[]>([]); // Lưu danh sách danh mục (bao gồm tùy chọn "Chọn Danh Mục")

  // State cho danh mục đã chọn từ Listbox
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>({ id: '', name: 'Chọn Danh Mục' });

  // Thông tin sản phẩm
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    description: '',
    slug: '',
    title: '',
    productDescription: '',
    categoryId: null, // Khởi tạo null
    productImages: [],
    coverImage: '',
    warrantyInfo: ''
  });

  // Các biến thể với thuộc tính riêng
  const [variants, setVariants] = useState<Variant[]>([]);

  // Lấy danh sách danh mục khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetAllCategory();
        // Thêm tùy chọn "Chọn Danh Mục" vào đầu danh sách
        if (res.data && Array.isArray(res.data.result)) {
            setCategories([{ id: '', name: 'Chọn Danh Mục' }, ...res.data.result]);
        } else {
            console.warn("Dữ liệu danh mục không đúng định dạng:", res);
            setCategories([{ id: '', name: 'Chọn Danh Mục' }]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  // Hàm upload file và nhận URL
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await upload(formData);
      return response.data.result; // Giả sử API trả về { url: string }
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      throw error;
    }
  };

  // Xử lý upload ảnh sản phẩm
  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      try {
        const urls = await Promise.all(uploadPromises);
        setProductInfo(prev => ({ ...prev, productImages: [...prev.productImages, ...urls] }));
      } catch (uploadError) {
        console.error("Failed to upload product images:", uploadError);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      }
    }
  };

  // Xử lý upload ảnh bìa
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setProductInfo(prev => ({ ...prev, coverImage: url }));
      } catch (uploadError) {
        console.error("Failed to upload cover image:", uploadError);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      }
    }
  };

  // Xử lý upload ảnh biến thể
  const handleVariantImageUpload = async (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setVariants(prev =>
          prev.map(v => (v.id === variantId ? { ...v, images: [...v.images, url] } : v))
        );
      } catch (uploadError) {
        console.error(`Failed to upload image for variant ${variantId}:`, uploadError);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      }
    }
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(), // Đảm bảo ID là duy nhất cho mỗi biến thể mới
      sku: '',
      price: '',
      quantity: '',
      attributes: [],
      images: []
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (id: string, field: string, value: string) => {
    setVariants(variants.map(variant =>
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };

  const addAttributeToVariant = (variantId: string) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, attributes: [...variant.attributes, { name: '', value: '' }] }
        : variant
    ));
  };

  const updateVariantAttribute = (variantId: string, attributeIndex: number, field: 'name' | 'value', value: string) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? {
            ...variant,
            attributes: variant.attributes.map((attr, index) =>
              index === attributeIndex ? { ...attr, [field]: value } : attr
            )
          }
        : variant
    ));
  };

  const removeAttributeFromVariant = (variantId: string, attributeIndex: number) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, attributes: variant.attributes.filter((_, index) => index !== attributeIndex) }
        : variant
    ));
  };

  const removeImageFromVariant = (variantId: string, imageIndex: number) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, images: variant.images.filter((_, index) => index !== imageIndex) }
        : variant
    ));
  };

  const handleSubmit = async () => {
    // Lấy categoryId từ `selectedCategory` state
    if (selectedCategory.id === '' || selectedCategory.id === null) {
      alert('Vui lòng chọn một danh mục!');
      return;
    }

    const categoryIdToSend = selectedCategory.id as number; // Chắc chắn là number khi gửi đi

    // Chuẩn bị dữ liệu để gửi lên backend
    const productData = {
      categoryId: categoryIdToSend,
      name: productInfo.name,
      slug: productInfo.slug,
      images: productInfo.productImages,
      coverImage: productInfo.coverImage,
      warrantyInfo: productInfo.warrantyInfo,
      variants: variants.map(v => ({
        sku: v.sku,
        price: Number(v.price), // Chuyển đổi sang số
        stock: Number(v.quantity), // Chuyển đổi sang số
        image: v.images[0] || '', // Lấy ảnh đầu tiên làm ảnh chính của biến thể
        attributes: v.attributes.map(a => ({
          name: a.name,
          displayName: a.name, // Có thể điều chỉnh displayName nếu cần
          attributeValue: a.value ? [{ value: a.value, displayValue: a.value }] : []
        }))
      }))
    };

    try {
      const response = await createProduct(productData); // Gọi API CreateProduct
      console.log('Sản phẩm đã được tạo:', response.data);
      // Đặt lại form và đóng modal
      setProductInfo({
        name: '',
        description: '',
        slug: '',
        title: '',
        productDescription: '',
        categoryId: null, // Reset về null
        productImages: [],
        coverImage: '',
        warrantyInfo: ''
      });
      setVariants([]);
      setSelectedCategory({ id: '', name: 'Chọn Danh Mục' }); // Reset danh mục đã chọn
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      // Thêm logic hiển thị lỗi cho người dùng
      alert('Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Thông Tin Sản Phẩm</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Tên Sản Phẩm *</label>
          <input
            type="text"
            value={productInfo.name}
            onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
            className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Áo Thun Cotton Nam"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Danh Mục *</label>
          {/* === PHẦN THAY THẾ SELECT MẶC ĐỊNH BẰNG HEADLESS UI LISTBOX === */}
          <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-xl bg-white/10 py-3 pl-4 pr-10 text-left text-white shadow-md border border-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                <span className="block truncate">{selectedCategory.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  {/* Nếu dùng Heroicons: <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {categories.map((cat) => (
                  <ListboxOption
                    key={cat.id} // Sử dụng cat.id làm key
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
                        {/* Bạn có thể thêm icon check ở đây nếu muốn hiển thị mục đã chọn */}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          {/* === HẾT PHẦN THAY THẾ === */}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Mô Tả Sản Phẩm *</label>
        <textarea
          rows={4}
          value={productInfo.description}
          onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Mô tả chi tiết sản phẩm của bạn..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={productInfo.slug}
            onChange={(e) => setProductInfo({ ...productInfo, slug: e.target.value })}
            className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="ao-thun-cotton-nam"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Tiêu Đề Sản Phẩm</label>
          <input
            type="text"
            value={productInfo.title}
            onChange={(e) => setProductInfo({ ...productInfo, title: e.target.value })}
            className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tiêu đề thân thiện với SEO"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Hình Ảnh Sản Phẩm</label>
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={handleProductImageUpload}
              className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {productInfo.productImages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {productInfo.productImages.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Product Image ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                  {/* Thêm nút xóa ảnh sản phẩm nếu cần */}
                  <button
                    onClick={() => {
                      setProductInfo(prev => ({
                        ...prev,
                        productImages: prev.productImages.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Xóa ảnh"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Hình Bìa</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleCoverImageUpload}
              className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {productInfo.coverImage && (
            <div className="mt-2 relative">
              <img src={productInfo.coverImage} alt="Cover Image" className="w-16 h-16 object-cover rounded-lg" />
              {/* Thêm nút xóa ảnh bìa nếu cần */}
              <button
                onClick={() => setProductInfo(prev => ({ ...prev, coverImage: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                title="Xóa ảnh bìa"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Thông Tin Bảo Hành</label>
        <textarea
          rows={3}
          value={productInfo.warrantyInfo}
          onChange={(e) => setProductInfo({ ...productInfo, warrantyInfo: e.target.value })}
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Điều khoản và điều kiện bảo hành..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Biến Thể Sản Phẩm</h3>
        <button
          onClick={addVariant}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Biến Thể</span>
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">Chưa có biến thể nào được thêm</h4>
          <p className="text-gray-400 mb-4">Thêm biến thể sản phẩm đầu tiên để bắt đầu</p>
          <button
            onClick={addVariant}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Thêm Biến Thể Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {variants.map((variant, variantIndex) => (
            <div key={variant.id} className="bg-white/5 rounded-xl p-6 border border-purple-500/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Biến Thể {variantIndex + 1}</h4>
                <button
                  onClick={() => removeVariant(variant.id)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thông tin cơ bản của biến thể */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">SKU *</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., TSH-BLU-M"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Giá *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Số Lượng *</label>
                  <input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Thuộc tính biến thể */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-white font-medium">Thuộc Tính Biến Thể</h5>
                  <button
                    onClick={() => addAttributeToVariant(variant.id)}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Thuộc Tính</span>
                  </button>
                </div>

                {variant.attributes.length === 0 ? (
                  <div className="text-center py-6 bg-white/5 rounded-lg border-2 border-dashed border-purple-500/20">
                    <p className="text-gray-400 text-sm mb-2">Chưa có thuộc tính nào được thêm</p>
                    <button
                      onClick={() => addAttributeToVariant(variant.id)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Thêm thuộc tính đầu tiên (e.g., Kích Cỡ, Màu Sắc, Chất Liệu)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variant.attributes.map((attribute, attributeIndex) => (
                      <div key={attributeIndex} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={attribute.name}
                            onChange={(e) => updateVariantAttribute(variant.id, attributeIndex, 'name', e.target.value)}
                            className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Tên thuộc tính (e.g., Kích Cỡ)"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={attribute.value}
                            onChange={(e) => updateVariantAttribute(variant.id, attributeIndex, 'value', e.target.value)}
                            className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Giá trị thuộc tính (e.g., Lớn)"
                          />
                        </div>
                        <button
                          onClick={() => removeAttributeFromVariant(variant.id, attributeIndex)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hình ảnh biến thể */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-white font-medium">Hình Ảnh Biến Thể</h5>
                </div>

                {variant.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {variant.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        <img
                          src={image}
                          alt={`Biến Thể - Hình ${imageIndex + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImageFromVariant(variant.id, imageIndex)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={(e) => handleVariantImageUpload(variant.id, e)}
                    className="flex-1 bg-white/10 border border-purple-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl w-full max-w-5xl max-h-[93vh] overflow-hidden">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Thêm Sản Phẩm Mới</h2>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {step}
                  </div>
                  {step < 2 && (
                    <div className={`w-8 h-1 mx-2 ${
                      currentStep > step ? 'bg-purple-600' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-2 text-sm text-gray-400">
              <span className={currentStep === 1 ? 'text-purple-400' : ''}>Thông Tin Sản Phẩm</span>
              <span className={currentStep === 2 ? 'text-purple-400' : ''}>Biến Thể & Thuộc Tính</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-purple-500/20">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay Lại
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>

            {currentStep < 2 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Tiếp Theo: Thêm Biến Thể
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Tạo Sản Phẩm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;