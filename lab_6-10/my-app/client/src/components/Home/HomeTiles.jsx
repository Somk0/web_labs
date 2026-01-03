import React from "react";
import PrimaryButton from "../UI/PrimaryButton";
import { Link } from "react-router-dom";

function HomeTiles({ items }) {
  const tiles = items.slice(0, 3);

  return (
    <section>
      <div className="tiles-row">
        {tiles.map((item, idx) => (
          <div key={item.id} className="tile">
            <div className="tile-image" />
            <div className="tile-title">
              {item.title || `Tile ${idx + 1} heading`}
            </div>
            <div className="text-muted">
              Автобус {item.fromCity} → {item.toCity}. Ціна від{" "}
              {item.price} грн.
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Link to="/catalog">
          <PrimaryButton>View more</PrimaryButton>
        </Link>
      </div>
    </section>
  );
}

export default HomeTiles;
