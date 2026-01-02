import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { ItemsContext } from "../App";
import { fetchBusById } from "../api/busesApi";
import { addToCart } from "../store/cartSlice";

import PrimaryButton from "../components/UI/PrimaryButton";
import Select from "../components/UI/Select";
import Loader from "../components/UI/Loader";

/* ---------- normalize item ---------- */
const normalizeItem = (item) => ({
  ...item,
  variants:
    item.variants?.length > 0
      ? item.variants
      : [
          { id: "standard", label: "Standard", price: item.price },
          { id: "comfort", label: "Comfort", price: item.price + 100 },
          { id: "vip", label: "VIP", price: item.price + 200 }
        ]
});

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useContext(ItemsContext);

  const [item, setItem] = useState(null);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ---------- load item ---------- */
  useEffect(() => {
    const localItem = items.find(b => String(b.id) === String(id));

    const load = localItem
      ? Promise.resolve(localItem)
      : fetchBusById(id);

    setLoading(true);

    load
      .then(data => {
        const normalized = normalizeItem(data);
        setItem(normalized);
        setVariantId(normalized.variants[0].id);
      })
      .finally(() => setLoading(false));
  }, [id, items]);

  if (loading || !item) return <Loader />;

  const selectedVariant = item.variants.find(
    v => v.id === variantId
  );

  /* ---------- add to cart ---------- */
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: item.id,
        productName: item.name || item.title,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.label,
        price: selectedVariant.price,
        qty
      })
    );
    navigate("/cart");
  };

  /* ---------- render ---------- */
  return (
    <div className="item-page">
      <h2 className="page-title">
        {item.name || item.title}
      </h2>

      <div className="item-layout">
        <div className="item-image-large" />

        <div className="item-info">
          <p className="text-muted">
            {item.from} → {item.to}
          </p>

          {/* Variant */}
          <div className="field-block">
            <label>Seat type</label>
            <Select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
            >
              {item.variants.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label} — {v.price} грн
                </option>
              ))}
            </Select>
          </div>

          {/* Quantity */}
          <div className="field-block">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, +e.target.value || 1))
              }
            />
          </div>

          {/* Price */}
          <div style={{ marginTop: 20 }}>
            <b>Price:</b>{" "}
            {selectedVariant.price * qty} грн
          </div>

          {/* Actions */}
          <div style={{ marginTop: 30 }}>
            <PrimaryButton
              style={{ marginRight: 10 }}
              onClick={() => navigate(-1)}
            >
              Go back
            </PrimaryButton>

            <PrimaryButton onClick={handleAddToCart}>
              Add to cart
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
