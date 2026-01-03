import React from "react";
import PrimaryButton from "../UI/PrimaryButton";
import { Link } from "react-router-dom";

function ProductCard({ item }) {
  return (
    <div className="card">
      <div className="card-image" />
      <div className="card-title">{item.title}</div>
      <div className="text-muted">
        {item.fromCity} → {item.toCity}
      </div>
      <div className="text-muted">
        {item.durationHours} год · {item.type}
      </div>
      <div className="card-price">
        Price: {item.price} грн
      </div>
      <div style={{ marginTop: 10 }}>
        <Link to={`/item/${item.id}`}>
          <PrimaryButton>View more</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
