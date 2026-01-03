import React from "react";
import PrimaryButton from "../UI/PrimaryButton";

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <div className="cart-row">
      <div>
        <div style={{ fontWeight: 600 }}>
          {item.title}
        </div>
        <div className="text-muted">
          Qty: {item.qty}
        </div>
      </div>
      <div className="cart-qty-controls">
        <button
          className="qty-btn"
          onClick={onDecrease}
        >
          -
        </button>
        <span>{item.qty}</span>
        <button
          className="qty-btn"
          onClick={onIncrease}
        >
          +
        </button>
      </div>
      <div>{item.price * item.qty} грн</div>
      <PrimaryButton onClick={onRemove}>
        Remove
      </PrimaryButton>
    </div>
  );
}

export default CartItem;
