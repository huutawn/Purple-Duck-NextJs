'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { CreateSeller } from '@/app/Service/Seller';
import { upload } from '@/app/Service/File';
import { toast } from "sonner"; // Giả sử dùng sonner cho toast, import nếu cần
import Cookies from 'js-cookie'; // Import để set roles

export default function SellerRegister() {
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeLogo: '' as string, // Bây giờ là string URL
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Loading cho upload
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview ngay
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload ngay khi chọn file
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file); // Key 'file' như yêu cầu
        
        const uploadResponse = await upload(uploadFormData);
        const logoUrl = uploadResponse.data.result; // Giả sử response trả về { data: { url: string } }
        
        setFormData(prev => ({
          ...prev,
          storeLogo: logoUrl,
        }));
        toast.success('Logo uploaded successfully!');
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast.error('Failed to upload logo. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi CreateSeller với JSON, storeLogo là URL đã upload
      const sellerData = {
        name: formData.storeName,
        description: formData.storeDescription,
        image: formData.storeLogo || '', // Nếu không có, gửi rỗng
      };
      
      const createResponse = await CreateSeller(sellerData.name,sellerData.description,sellerData.image);
      
      // Xử lý success dựa trên code (giả sử code === 200 hoặc code === 0 là success, adjust nếu khác)
      if (createResponse.data.code === 1000) { // Hoặc check createResponse.data.resulte nếu cần
        toast.success('Store created successfully!');
        Cookies.set('roles', 'SELLER'); // Set lại roles = SELLER
        router.push('/seller'); // Redirect sang trang seller sau submit thành công
      } else {
        toast.error('Failed to create store. Please try again.');
      }
    } catch (error) {
      console.error('Error in submission:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 rounded-xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Become a Seller
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Start Your Store Journey
            </h1>
            <p className="text-gray-600">
              Join thousands of successful sellers on PurpleDuck and grow your business
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-purple-50 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Your Own Store</h3>
              <p className="text-sm text-gray-600">Create your branded storefront</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Easy Setup</h3>
              <p className="text-sm text-gray-600">Get started in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold text-lg">$</span>
              </div>
              <h3 className="font-medium text-gray-900">Low Fees</h3>
              <p className="text-sm text-gray-600">Competitive commission rates</p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your store name"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed to customers as your brand name
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Description *
              </label>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe your store, products, and what makes you unique..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tell customers about your store and what you sell (minimum 50 characters)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      id="storeLogo"
                      name="storeLogo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <label htmlFor="storeLogo" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload your store logo {isUploading ? '(Uploading...)' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB (recommended: 200x200px)
                      </p>
                    </label>
                  </div>
                </div>
                {logoPreview && (
                  <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/seller-policy" className="text-purple-600 hover:text-purple-700 font-medium">
                    Seller Policy
                  </Link>
                  . I understand that my store will be reviewed before approval.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Your Store...
                </div>
              ) : (
                'Create My Store'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have a seller account?{' '}
              <Link href="/seller" className="text-purple-600 hover:text-purple-700 font-medium">
                Go to Seller Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}