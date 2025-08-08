'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

import { upload } from '@/app/Service/File';
import { GetAllCategory } from '@/app/Service/Category';
import { createProduct } from '@/app/Service/products';
import { CreateProductRequest } from '@/app/types/product';

// --- CÁC TYPE GỐC CỦA BẠN (GIỮ NGUYÊN) ---
type VariantAttribute = {
    name: string;
    value: string;
};

type Variant = {
    id: string;
    sku: string;
    price: string;
    quantity: string;
    attributes: VariantAttribute[];
    images: string[];
};

type Category = {
    id: number;
    name: string;
};
// --- KẾT THÚC CÁC TYPE GỐC ---


// --- TYPE MỚI CHO LOGIC TẠO BIẾN THỂ TRONG UI ---
type AttributeSet = {
    id: string;
    name: string;
    values: string; // Chuỗi giá trị, ví dụ: "S, M, L"
};

type CategoryOption = {
    id: number | '';
    name: string;
};

type ProductInfo = {
    name: string;
    description: string;
    slug: string;
    title: string;
    productDescription: string;
    categoryId: number | null;
    productImages: string[];
    coverImage: string;
    warrantyInfo: string;
};

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption>({ id: '', name: 'Chọn Danh Mục' });
    const [productInfo, setProductInfo] = useState<ProductInfo>({
        name: '',
        description: '',
        slug: '',
        title: '',
        productDescription: '',
        categoryId: null,
        productImages: [],
        coverImage: '',
        warrantyInfo: ''
    });

    const [attributeSets, setAttributeSets] = useState<AttributeSet[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await GetAllCategory();
                if (res.data && Array.isArray(res.data.result)) {
                    setCategories([{ id: '', name: 'Chọn Danh Mục' }, ...res.data.result.map((cat: any) => ({ id: cat.id, name: cat.name }))]);
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

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await upload(formData);
            return response.data.result;
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            throw error;
        }
    };

    const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const uploadPromises = Array.from(files).map(file => uploadImage(file));
            try {
                const urls = await Promise.all(uploadPromises);
                setProductInfo(prev => ({ ...prev, productImages: [...prev.productImages, ...urls] }));
            } catch (uploadError) {
                console.error("Failed to upload product images:", uploadError);
            }
        }
    };

    const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const url = await uploadImage(file);
                setProductInfo(prev => ({ ...prev, coverImage: url }));
            } catch (uploadError) {
                console.error("Failed to upload cover image:", uploadError);
            }
        }
    };
    
    const addAttributeSet = () => {
        setAttributeSets(prev => [...prev, { id: Date.now().toString(), name: '', values: '' }]);
    };
    const updateAttributeSet = (id: string, field: 'name' | 'values', value: string) => {
        setAttributeSets(prev => prev.map(attr => attr.id === id ? { ...attr, [field]: value } : attr));
    };
    const removeAttributeSet = (id: string) => {
        setAttributeSets(prev => prev.filter(attr => attr.id !== id));
    };

    const generateAllVariants = () => {
        const validAttributes = attributeSets.filter(a => a.name && a.values);
        if (validAttributes.length === 0) {
            setVariants([]);
            return;
        }

        const combinations: VariantAttribute[][] = [];
        const attributeValueArrays = validAttributes.map(a => a.values.split(',').map(v => ({ name: a.name, value: v.trim() })));
        
        function combine(arr: VariantAttribute[][], index: number, currentCombination: VariantAttribute[]) {
            if (index === arr.length) {
                combinations.push(currentCombination);
                return;
            }
            for (let i = 0; i < arr[index].length; i++) {
                combine(arr, index + 1, [...currentCombination, arr[index][i]]);
            }
        }
        
        combine(attributeValueArrays, 0, []);
        
        const newVariants: Variant[] = combinations.map((combo) => {
            const skuBase = productInfo.name.substring(0,3).toUpperCase();
            const skuSuffix = combo.map(c => c.value.substring(0,2).toUpperCase()).join('-');
            return {
                id: `${Date.now()}-${Math.random()}`,
                sku: `${skuBase}-${skuSuffix}`,
                price: '',
                quantity: '',
                attributes: combo,
                images: [],
            };
        });
        setVariants(newVariants);
        setCurrentStep(2);
    };

    const updateVariant = (id: string, field: string, value: string) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const removeVariant = (id: string) => {
        setVariants(prev => prev.filter(v => v.id !== id));
    };
    
    const removeImageFromVariant = (variantId: string, imageIndex: number) => {
        setVariants(prev =>
            prev.map(v => (v.id === variantId ? { ...v, images: v.images.filter((_, index) => index !== imageIndex) } : v))
        );
    };

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
            }
        }
    };

    const handleSubmit = async () => {
        if (selectedCategory.id === '' || selectedCategory.id === null) {
            alert('Vui lòng chọn một danh mục!');
            return;
        }

        const categoryIdToSend = selectedCategory.id as number;

        const productData: CreateProductRequest = {
            categoryId: categoryIdToSend,
            name: productInfo.name,
            slug: productInfo.slug,
            images: productInfo.productImages,
            coverImage: productInfo.coverImage,
            warrantyInfo: productInfo.warrantyInfo,
            variants: variants.map(v => ({
                sku: v.sku,
                price: Number(v.price),
                stock: Number(v.quantity),
                image: v.images[0] || '',
                attributes: v.attributes.map(a => ({
                    name: a.name,
                    displayName: a.name,
                    attributeValue: a.value ? [{ value: a.value, displayValue: a.value }] : []
                }))
            }))
        };
        
        try {
            const response = await createProduct(productData);
            console.log('Sản phẩm đã được tạo:', response.data);
            onClose();
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
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
                    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                        <div className="relative">
                            <ListboxButton className="relative w-full cursor-default rounded-xl bg-white/10 py-3 pl-4 pr-10 text-left text-white shadow-md border border-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                                <span className="block truncate">{selectedCategory.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </ListboxButton>
                            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {categories.map((cat) => (
                                    <ListboxOption key={cat.id} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-purple-600 text-white' : 'text-gray-300'}`} value={cat}>
                                        {({ selected }) => (
                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{cat.name}</span>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Tiêu đề SEO</label>
                    <textarea
                        rows={4}
                        value={productInfo.title}
                        onChange={(e) => setProductInfo({ ...productInfo, title: e.target.value })}
                        className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tiêu đề thân thiện với SEO"
                    />
                </div>
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
            {/* ... (Các trường khác của Step 1) */}
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
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Biến Thể Sản Phẩm</h3>
                <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Biến Thể</span>
                </button>
            </div>

            {/* PHẦN NHẬP THUỘC TÍNH VÀ GIÁ TRỊ (MỚI) */}
            <div className="space-y-4">
                <h4 className="text-white font-medium">1. Nhập các thuộc tính và giá trị</h4>
                {attributeSets.map((attr, index) => (
                    <div key={attr.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                        <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => updateAttributeSet(attr.id, 'name', e.target.value)}
                            className="flex-1 bg-white/10 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                            placeholder="Tên thuộc tính (e.g., Size)"
                        />
                        <input
                            type="text"
                            value={attr.values}
                            onChange={(e) => updateAttributeSet(attr.id, 'values', e.target.value)}
                            className="flex-1 bg-white/10 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                            placeholder="Giá trị (e.g., S, M, L)"
                        />
                        <button
                            onClick={() => removeAttributeSet(attr.id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addAttributeSet}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Thuộc Tính</span>
                </button>
                <button
                    onClick={generateAllVariants}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors font-medium mt-4"
                >
                    Tự Động Tạo Tất Cả Biến Thể
                </button>
            </div>

            {/* PHẦN HIỂN THỊ VÀ CHỈNH SỬA BIẾN THỂ ĐÃ TẠO */}
            <div className="space-y-6 mt-8">
                <h4 className="text-white font-medium">2. Chỉnh sửa chi tiết từng biến thể</h4>
                {variants.length > 0 ? (
                    variants.map((variant, variantIndex) => (
                        <div key={variant.id} className="bg-white/5 rounded-xl p-6 border border-purple-500/10">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="text-white font-semibold">
                                    {productInfo.name} - {variant.attributes.map(a => a.value).join(' / ')}
                                </h5>
                                <button
                                    onClick={() => removeVariant(variant.id)}
                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">SKU</label>
                                    <input type="text" value={variant.sku} onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)} className="w-full bg-white/10 rounded-lg px-3 py-2 text-white" placeholder="SKU" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Giá</label>
                                    <input type="number" value={variant.price} onChange={(e) => updateVariant(variant.id, 'price', e.target.value)} className="w-full bg-white/10 rounded-lg px-3 py-2 text-white" placeholder="Giá" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Số lượng</label>
                                    <input type="number" value={variant.quantity} onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)} className="w-full bg-white/10 rounded-lg px-3 py-2 text-white" placeholder="Số lượng" />
                                </div>
                            </div>
                            {/* ... (Phần upload và hiển thị ảnh cho từng biến thể) */}
                             <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Hình ảnh biến thể</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={(e) => handleVariantImageUpload(variant.id, e)}
                                        className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                {variant.images.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {variant.images.map((url, imgIndex) => (
                                            <div key={imgIndex} className="relative">
                                                <img src={url} alt={`Variant Image ${imgIndex + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                                                <button
                                                    onClick={() => removeImageFromVariant(variant.id, imgIndex)}
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
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 bg-white/5 rounded-xl">
                        <p className="text-gray-400">Chưa có biến thể nào được tạo. Hãy nhập thuộc tính và nhấn nút "Tự động tạo".</p>
                    </div>
                )}
            </div>
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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                        {step}
                                    </div>
                                    {step < 2 && (
                                        <div className={`w-8 h-1 mx-2 ${currentStep > step ? 'bg-purple-600' : 'bg-gray-600'}`} />
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