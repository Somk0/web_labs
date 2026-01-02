import React, {
  useContext,
  useEffect,
  useState
} from "react";
import { ItemsContext } from "../App";
import { fetchBuses } from "../api/busesApi";
import FiltersBar from "../components/Catalog/FiltersBar";
import ProductCard from "../components/Catalog/ProductCard";
import Loader from "../components/UI/Loader";

function Catalog() {
  const { items, setItems } = useContext(ItemsContext);
  const [loading, setLoading] = useState(false);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetchBuses({
      fromCity,
      toCity,
      type,
      search
    })
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (items.length === 0) {
      load();
    }
    
  }, []);

  return (
    <div>
      <h2 className="page-title">Catalog Page</h2>

      <FiltersBar
        fromCity={fromCity}
        toCity={toCity}
        type={type}
        setFromCity={setFromCity}
        setToCity={setToCity}
        setType={setType}
        search={search}
        setSearch={setSearch}
        apply={load}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="catalog-grid">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
