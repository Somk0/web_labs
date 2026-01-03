import React from "react";
import Select from "../UI/Select";
import PrimaryButton from "../UI/PrimaryButton";

function FiltersBar({
  fromCity,
  toCity,
  type,
  setFromCity,
  setToCity,
  setType,
  search,
  setSearch,
  apply
}) {
  return (
    <div className="catalog-filters">
      <Select
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
      >
        <option value="">From (any)</option>
        <option value="Lviv">Lviv</option>
        <option value="Kyiv">Kyiv</option>
      </Select>

      <Select
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
      >
        <option value="">To (any)</option>
        <option value="Kyiv">Kyiv</option>
        <option value="Odesa">Odesa</option>
        <option value="Warsaw">Warsaw</option>
        <option value="Krakow">Krakow</option>
      </Select>

      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Type</option>
        <option value="day">Day</option>
        <option value="night">Night</option>
        <option value="international">International</option>
        <option value="regional">Regional</option>
      </Select>

      <input
        style={{ flex: 1, padding: "5px 8px" }}
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <PrimaryButton onClick={apply}>
        Apply
      </PrimaryButton>
    </div>
  );
}

export default FiltersBar;
