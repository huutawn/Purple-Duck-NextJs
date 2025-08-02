// src/hooks/useCart.ts

import { useApp } from '../context/AppContext';
// Chỉ import các type cần thiết, không còn CartItem hay CartItemVariantInfo
import { Product, CartItemResponse } from '../types';
import { 
    addProductToCartBackend, 
    AddToCartBackendRequest, 
    getCartFromBackEnd // Đổi tên getCartFromBE -> getCartFromBackend cho rõ nghĩa
} from '@/app/Service/Cart';

export function useCart() {
  const { state, dispatch } = useApp();

  /**
   * Lấy toàn bộ giỏ hàng từ backend và dispatch thẳng dữ liệu gốc vào state.
   */
  const getCart = async () => {
    try {
      // Giả định hàm service trả về toàn bộ response từ axios
      const backendResponse = await getCartFromBackEnd();
      
      // Truy cập vào dữ liệu trả về từ API
      const apiResult = backendResponse.data;

      if (apiResult.code === 1000 && apiResult.result) {
        // KHÔNG CẦN BIẾN ĐỔI. Dispatch thẳng payload là mảng CartItemResponse[]
        // Giả sử API trả về CartResponse, ta lấy thuộc tính cartItems
        dispatch({ type: 'SET_CART', payload: apiResult.result });
      } else {
        console.error("Lấy giỏ hàng thất bại (Backend):", apiResult.message);
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error: any) {
      console.error("Lỗi khi gọi API lấy giỏ hàng:", error);
    }
  };

  /**
   * Thêm một sản phẩm vào giỏ hàng và gọi getCart() để đồng bộ lại state.
   * Đây là cách tiếp cận an toàn và đảm bảo dữ liệu luôn đúng.
   */
  const addToCart = async (
    product: Product,
    quantity: number,
    selectedVariantId: number,
    attributeValueIds: number[]
  ) => {
    const backendRequest: AddToCartBackendRequest = {
      productId: product.id,
      attributeValueIds: attributeValueIds,
      quantity: quantity,
    };

    try {
      const backendResponse = await addProductToCartBackend(backendRequest);

      if (backendResponse.code === 1000) {
        // Cách tốt nhất: gọi lại getCart() để lấy dữ liệu mới nhất từ server
        await getCart();
      } else {
        throw new Error(backendResponse.message || "Không thể thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  };

  /**
   * Xóa một item khỏi giỏ hàng dựa trên ID (number) của CartItemResponse.
   */
  const removeFromCart = (cartItemId: number) => {
    // TODO: Gọi API để xóa item trên server trước khi dispatch
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
  };

  /**
   * Cập nhật số lượng của một item trong giỏ hàng.
   */
  const updateCartItem = (cartItemId: number, newQuantity: number) => {
    // TODO: Gọi API để cập nhật item trên server trước khi dispatch
    if (newQuantity > 0) {
        dispatch({ type: 'UPDATE_CART_ITEM', payload: { id: cartItemId, quantity: newQuantity } });
    } else {
        removeFromCart(cartItemId);
    }
  };

  /**
   * Xóa toàn bộ giỏ hàng.
   */
  const clearCart = () => {
    // TODO: Gọi API để xóa toàn bộ giỏ hàng trên server
    dispatch({ type: 'CLEAR_CART' });
  };

  /**
   * Tính tổng tiền của giỏ hàng.
   * Phải truy cập vào mảng lồng nhau item.variants[0].
   */
  const getCartTotal = (): number => {
  return state.cart?.reduce((total, item) => {
    const variant = item.variants[0];
    if (variant) {
        return total + (variant.price * variant.quantity);
    }
    return total;
  }, 0) ?? 0;
};

  /**
   * Đếm tổng số lượng sản phẩm trong giỏ hàng.
   */
 const getCartItemCount = (): number => {
  // Thêm `?.` để chỉ gọi reduce nếu cart là mảng
  // Thêm `?? 0` để trả về 0 nếu kết quả là undefined
  return state.cart?.reduce((count, item) => {
    const variant = item.variants[0];
    if (variant) {
        return count + variant.quantity;
    }
    return count;
  }, 0) ?? 0;
};
  return {
    cart: state.cart,
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };
}