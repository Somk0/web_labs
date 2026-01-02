import React, { useContext, useEffect, useState } from "react";
import { ItemsContext } from "../App";
import { fetchBuses } from "../api/busesApi";
import HomeTiles from "../components/Home/HomeTiles";
import Loader from "../components/UI/Loader";

function Home() {
  const { items, setItems } = useContext(ItemsContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setLoading(true);
      fetchBuses({ limit: 3 })
        .then((data) => setItems(data))
        .finally(() => setLoading(false));
    }
  }, [items.length, setItems]);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-image" />
        <div className="hero-text-block">
          <h1>Heading</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nunc maximus, nulla ut commodo
            sagittis, sapien dui mattis dui, non pulvinar
            lorem felis nec erat.
          </p>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <HomeTiles items={items} />
      )}
    </div>
  );
}

export default Home;
