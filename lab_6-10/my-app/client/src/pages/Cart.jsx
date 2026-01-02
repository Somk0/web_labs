import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  increaseQty,
  decreaseQty,
  removeItem
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/UI/PrimaryButton";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div>
      <h2 className="page-title">Shopping Cart</h2>

      <div className="cart-list">
        {items.map(item => (
  <div key={item.cartItemId} className="cart-item">

    <h4>{item.productName}</h4>

    <p className="text-muted">
      Seat type: {item.variantLabel}
    </p>

    <div>
      Qty:
      <button onClick={() => dispatch(decreaseQty(item.cartItemId))}>
        −
      </button>
      <span style={{ margin: "0 8px" }}>{item.qty}</span>
      <button onClick={() => dispatch(increaseQty(item.cartItemId))}>
        +
      </button>
    </div>

    <p>
      {item.price * item.qty} грн
    </p>

    <button onClick={() => dispatch(removeItem(item.cartItemId))}>
      Remove
    </button>

  </div>
))}
      </div>

      <div
        style={{
          textAlign: "right",
          marginTop: 16,
          fontWeight: 600
        }}
      >
        Total amount: {total} грн
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 30
        }}
      >
        <PrimaryButton onClick={() => navigate("/catalog")}>
          Back to Catalog
        </PrimaryButton>
        <PrimaryButton
          disabled={items.length === 0}
          onClick={() => navigate("/checkout")}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}

export default Cart;
