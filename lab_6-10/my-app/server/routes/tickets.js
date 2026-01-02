const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/data.json");

function loadData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}


router.get("/", (req, res) => {
  const db = loadData();
  let tickets = db.tickets || [];

  const { ticketTypes, classes, priceMin, priceMax, q } = req.query;

  if (ticketTypes) {
    const tts = ticketTypes.split(",").map((s) => s.trim());
    tickets = tickets.filter((t) => tts.includes(t.ticketType));
  }

  if (classes) {
    const cls = classes.split(",").map((s) => s.trim());
    tickets = tickets.filter((t) => cls.includes(t.class));
  }

  if (priceMin) {
    const min = parseFloat(priceMin);
    tickets = tickets.filter((t) => t.price >= min);
  }

  if (priceMax) {
    const max = parseFloat(priceMax);
    tickets = tickets.filter((t) => t.price <= max);
  }

  if (q) {
    const qq = q.toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.name.toLowerCase().includes(qq) ||
        t.route.toLowerCase().includes(qq)
    );
  }

  res.json({ data: tickets });
});


router.get("/:id", (req, res) => {
  const db = loadData();
  const ticket = db.tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Not found" });
  res.json({ data: ticket });
});

module.exports = router;
