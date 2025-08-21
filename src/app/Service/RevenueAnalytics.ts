// src/app/Service/RevenueAnalytics.ts

import { axiosClient } from './ApiClient';

export interface DailyRevenue {
  date: string;
  revenue: number;
  netRevenue: number;
  transactions: number;
  averageOrderValue: number;
  growthPercentage: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  netRevenue: number;
  transactions: number;
  averageOrderValue: number;
  growthPercentage: number;
}

export interface YearlyRevenue {
  year: number;
  revenue: number;
  netRevenue: number;
  transactions: number;
  averageOrderValue: number;
  growthPercentage: number;
}

export interface DashboardMetrics {
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  totalRevenue: number;
  todayGrowth: number;
  monthGrowth: number;
  yearGrowth: number;
  todayTransactions: number;
  monthTransactions: number;
  yearTransactions: number;
  totalTransactions: number;
  averageOrderValue: number;
  topSellingProductRevenue: number;
  topSellingProductName: string;
  last30Days: DailyRevenue[];
  last12Months: MonthlyRevenue[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
}

export class RevenueAnalyticsService {
  
  /**
   * Lấy tất cả chỉ số dashboard cho seller
   */
  static async getDashboardMetrics(sellerId: number): Promise<DashboardMetrics> {
    try {
      const response = await axiosClient.get<ApiResponse<DashboardMetrics>>(
        `/revenue/dashboard/${sellerId}`
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw new Error('Không thể tải dữ liệu dashboard');
    }
  }

  /**
   * Lấy dữ liệu doanh thu theo ngày
   */
  static async getDailyRevenue(
    sellerId: number, 
    startDate: string, 
    endDate: string
  ): Promise<DailyRevenue[]> {
    try {
      const response = await axiosClient.get<ApiResponse<DailyRevenue[]>>(
        `/revenue/daily/${sellerId}`,
        {
          params: { startDate, endDate }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching daily revenue:', error);
      throw new Error('Không thể tải dữ liệu doanh thu theo ngày');
    }
  }

  /**
   * Lấy dữ liệu doanh thu theo ngày có phân trang
   */
  static async getDailyRevenuePaginated(
    sellerId: number,
    startDate: string,
    endDate: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'salesDate',
    sortDir: string = 'DESC'
  ): Promise<PageResponse<DailyRevenue>> {
    try {
      const response = await axiosClient.get<ApiResponse<PageResponse<DailyRevenue>>>(
        `/revenue/daily/${sellerId}/paginated`,
        {
          params: { startDate, endDate, page, size, sortBy, sortDir }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching paginated daily revenue:', error);
      throw new Error('Không thể tải dữ liệu doanh thu có phân trang');
    }
  }

  /**
   * Lấy dữ liệu doanh thu theo tháng
   */
  static async getMonthlyRevenue(
    sellerId: number, 
    year?: number
  ): Promise<MonthlyRevenue[]> {
    try {
      const params: any = {};
      if (year) params.year = year;

      const response = await axiosClient.get<ApiResponse<MonthlyRevenue[]>>(
        `/revenue/monthly/${sellerId}`,
        { params }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw new Error('Không thể tải dữ liệu doanh thu theo tháng');
    }
  }

  /**
   * Lấy dữ liệu doanh thu theo năm
   */
  static async getYearlyRevenue(sellerId: number): Promise<YearlyRevenue[]> {
    try {
      const response = await axiosClient.get<ApiResponse<YearlyRevenue[]>>(
        `/revenue/yearly/${sellerId}`
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching yearly revenue:', error);
      throw new Error('Không thể tải dữ liệu doanh thu theo năm');
    }
  }

  /**
   * Cập nhật dữ liệu doanh thu cho một ngày cụ thể
   */
  static async updateDailySalesRevenue(
    sellerId: number, 
    date: string
  ): Promise<string> {
    try {
      const response = await axiosClient.post<ApiResponse<string>>(
        `/revenue/update/${sellerId}`,
        null,
        { params: { date } }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error updating daily sales revenue:', error);
      throw new Error('Không thể cập nhật dữ liệu doanh thu');
    }
  }

  /**
   * Lấy tổng quan analytics toàn diện
   */
  static async getAnalyticsOverview(
    sellerId: number,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosClient.get<ApiResponse<any>>(
        `/analytics/overview/${sellerId}`,
        { params }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      throw new Error('Không thể tải tổng quan analytics');
    }
  }

  /**
   * Format tiền tệ theo định dạng VND hoặc USD
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format ngày tháng
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN');
  }

  /**
   * Tính phần trăm tăng trưởng
   */
  static calculateGrowthPercentage(current: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}

export default RevenueAnalyticsService;
