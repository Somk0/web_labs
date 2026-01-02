import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cart"));

const initialState = {
  items: savedCart || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart(state, action) {
      const item = action.payload;

      const existing = state.items.find(
        i =>
          i.productId === item.productId &&
          i.variantId === item.variantId
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          cartItemId: `${item.productId}-${item.variantId}`,
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantLabel: item.variantLabel,
          price: item.price,
          qty: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    increaseQty(state, action) {
      const item = state.items.find(
        i => i.cartItemId === action.payload
      );

      if (item) item.qty += 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    decreaseQty(state, action) {
      const item = state.items.find(
        i => i.cartItemId === action.payload
      );

      if (item && item.qty > 1) item.qty -= 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeItem(state, action) {
      state.items = state.items.filter(
        i => i.cartItemId !== action.payload
      );

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    }
  }
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
