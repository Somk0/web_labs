const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let buses = [
  {
    id: 1,
    title: "Lviv → Kyiv (Night Express)",
    fromCity: "Lviv",
    toCity: "Kyiv",
    type: "night",
    durationHours: 8,
    price: 450,
    image:
      "https://via.placeholder.com/260x160.png?text=Lviv-Kyiv",
    description:
      "Зручний нічний рейс з кондиціонером, Wi-Fi та розетками біля кожного місця."
  },
  {
    id: 2,
    title: "Lviv → Warsaw",
    fromCity: "Lviv",
    toCity: "Warsaw",
    type: "international",
    durationHours: 9,
    price: 700,
    image:
      "https://via.placeholder.com/260x160.png?text=Lviv-Warsaw",
    description:
      "Щоденний міжнародний рейс до Варшави. Комфортні сидіння, ручна поклажа включена."
  },
  {
    id: 3,
    title: "Kyiv → Odesa",
    fromCity: "Kyiv",
    toCity: "Odesa",
    type: "day",
    durationHours: 7,
    price: 550,
    image:
      "https://via.placeholder.com/260x160.png?text=Kyiv-Odesa",
    description:
      "Денний рейс до Одеси з зупинками у Вінниці та Умані. Кава/чай у дорозі."
  },
  {
    id: 4,
    title: "Lviv → Krakow",
    fromCity: "Lviv",
    toCity: "Krakow",
    type: "international",
    durationHours: 6,
    price: 650,
    image:
      "https://via.placeholder.com/260x160.png?text=Lviv-Krakow",
    description:
      "Популярний рейс до Кракова. Включено 1 місце багажу до 20 кг."
  },
  {
    id: 5,
    title: "Lviv → Uzhhorod",
    fromCity: "Lviv",
    toCity: "Uzhhorod",
    type: "regional",
    durationHours: 4.5,
    price: 300,
    image:
      "https://via.placeholder.com/260x160.png?text=Lviv-Uzhhorod",
    description:
      "Комфортний рейс через мальовничі Карпати. Кондиціонер, Wi-Fi."
  }
];


let cart = []; 


function filterBuses(query) {
  const {
    fromCity,
    toCity,
    type,
    minPrice,
    maxPrice,
    search,
    limit
  } = query;

  let result = [...buses];

  if (fromCity) {
    result = result.filter(
      (b) =>
        b.fromCity.toLowerCase() === fromCity.toLowerCase()
    );
  }
  if (toCity) {
    result = result.filter(
      (b) => b.toCity.toLowerCase() === toCity.toLowerCase()
    );
  }
  if (type) {
    result = result.filter(
      (b) => b.type.toLowerCase() === type.toLowerCase()
    );
  }
  if (minPrice) {
    result = result.filter(
      (b) => b.price >= Number(minPrice)
    );
  }
  if (maxPrice) {
    result = result.filter(
      (b) => b.price <= Number(maxPrice)
    );
  }
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.description.toLowerCase().includes(s) ||
        b.fromCity.toLowerCase().includes(s) ||
        b.toCity.toLowerCase().includes(s)
    );
  }

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  return result;
}




app.get("/api/buses", (req, res) => {
  const filtered = filterBuses(req.query);
  res.json(filtered);
});


app.get("/api/buses/:id", (req, res) => {
  const id = Number(req.params.id);
  const bus = buses.find((b) => b.id === id);
  if (!bus) {
    return res
      .status(404)
      .json({ message: "Bus not found" });
  }
  res.json(bus);
});




app.get("/api/cart", (req, res) => {
  const detailed = cart.map((item) => {
    const bus = buses.find((b) => b.id === item.busId);
    return {
      ...item,
      bus,
      subtotal: (bus?.price || 0) * item.qty
    };
  });

  const total = detailed.reduce(
    (sum, i) => sum + i.subtotal,
    0
  );

  res.json({ items: detailed, total });
});


app.post("/api/cart", (req, res) => {
  const { busId, qty } = req.body;
  const existing = cart.find(
    (i) => i.busId === Number(busId)
  );
  if (existing) {
    existing.qty += qty || 1;
  } else {
    cart.push({ busId: Number(busId), qty: qty || 1 });
  }
  res.status(201).json({ message: "Added to cart" });
});


app.put("/api/cart/:busId", (req, res) => {
  const id = Number(req.params.busId);
  const { qty } = req.body;
  const item = cart.find((i) => i.busId === id);
  if (!item) {
    return res
      .status(404)
      .json({ message: "Not in cart" });
  }
  item.qty = qty;
  res.json({ message: "Updated" });
});


app.delete("/api/cart/:busId", (req, res) => {
  const id = Number(req.params.busId);
  cart = cart.filter((i) => i.busId !== id);
  res.json({ message: "Removed" });
});

app.listen(PORT, () => {
  console.log(`Bus API running on port ${PORT}`);
});
