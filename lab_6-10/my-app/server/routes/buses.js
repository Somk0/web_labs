import express from "express";
import { buses } from "../data/buses.js";

const router = express.Router();


router.get("/", (req, res) => {
  let results = [...buses];

  const { from, to, type, minPrice, maxPrice, search } = req.query;

  if (from) {
    results = results.filter(bus =>
      bus.from.toLowerCase().includes(from.toLowerCase())
    );
  }

  if (to) {
    results = results.filter(bus =>
      bus.to.toLowerCase().includes(to.toLowerCase())
    );
  }

  if (type && type !== "all") {
    results = results.filter(bus =>
      bus.type.toLowerCase() === type.toLowerCase()
    );
  }

  if (search) {
    results = results.filter(bus =>
      bus.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (minPrice) {
    results = results.filter(bus => bus.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(bus => bus.price <= Number(maxPrice));
  }

  res.json(results);
});


router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const bus = buses.find(b => b.id === id);

  if (!bus) {
    return res.status(404).json({ error: "Bus not found" });
  }

  res.json(bus); 
});

export default router;
