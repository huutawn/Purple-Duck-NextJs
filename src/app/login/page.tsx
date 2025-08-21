// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Cookies from 'js-cookie';
import { login, createUser } from '@/app/Service/Auth'; // Đảm bảo đường dẫn chính xác
import { toast } from "sonner";
import { useProfileStore } from "@/app/zustand/store";
import { OauthConfig } from '../config/Oauth2Config';

export default function Login() {
  const { fetchProfile, fetchCart } = useProfileStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: { user }, dispatch } = useApp();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleLogin = () => {
    // Lấy giá trị từ OAuthConfig
    const callbackUrl = OauthConfig.redirectUri;
    const authUrl = OauthConfig.authUri;
    const googleClientId = OauthConfig.clientId;

    if (!googleClientId) {
      console.error("Google Client ID is not configured in OAuthConfig. Please check .env.local.");
      toast.error("Đăng nhập Google chưa được cấu hình. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    // Đảm bảo các scope là đúng, bạn có thể cứng hóa hoặc lấy từ config nếu muốn
    const scopes = encodeURIComponent('openid profile email'); // Hoặc OAuthConfig.defaultScopes nếu bạn thêm vào

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=${scopes}&prompt=select_account`;

    console.log("Redirecting to Google:", targetUrl);
    window.location.href = targetUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        
        toast.success("Đăng nhập thành công");
        const token = res.data.result.token;
        const refreshToken = res.data.result.refreshToken;
        
        Cookies.set('authToken', token);
        Cookies.set('refreshToken', refreshToken);
        
        await fetchProfile();
        await fetchCart();

        const role = Cookies.get("roles");

        if (role === "ADMIN") {
          router.replace("/admin");
        } else if (role === "SELLER") {
          router.replace("/seller");
        } else {
          router.replace("/");
        }

      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Mật khẩu không khớp');
        }
        
        const res = await createUser(formData.email, formData.password, formData.name);
        
        console.log(res);
        toast.success("Đăng ký thành công. Vui lòng đăng nhập bằng tài khoản mới của bạn.");
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          name: '',
          confirmPassword: '',
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.data?.code === 1005) {
        setError("Mật khẩu không đúng.");
        toast.error("Mật khẩu không đúng.");
      } else if (err.response?.data?.code === 1004) {
        setError("Email không đúng.");
        toast.error("Email không đúng.");
      } else if (err.response?.data?.data?.code === 1001 && !isLogin) {
        setError(err.response?.data?.message);
        toast.error(err.response?.data?.message);
      } else {
        setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        toast.error(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 rounded-xl">
                <div className="w-8 h-8 text-white flex items-center justify-center font-bold text-xl">
                  🦆
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                PurpleDuck
              </span>
            </Link>
            
            <p className="mt-2 text-sm text-gray-600">
              {isLogin
                ? 'Đăng nhập vào tài khoản của bạn để tiếp tục mua sắm'
                : 'Tham gia PurpleDuck và bắt đầu hành trình mua sắm của bạn'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Xác nhận mật khẩu của bạn"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
Quên mật khẩu?
                </Link>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...'}
                </div>
              ) : (
                isLogin ? 'Đăng nhập' : 'Tạo tài khoản'
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center  py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

             
          </div>
        </div>
      </div>
    </div>
  );
}