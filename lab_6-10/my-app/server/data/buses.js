export const buses = [
  {
    id: 1,
    from: "Lviv",
    to: "Kyiv",
    name: "Lviv → Kyiv",
    variants: [
      {
        id: "standard",
        label: "Standard",
        price: 450,
        duration: "8h"
      },
      {
        id: "comfort",
        label: "Comfort",
        price: 550,
        duration: "8h"
      },
      {
        id: "premium",
        label: "Premium",
        price: 650,
        duration: "8h"
      }
    ]
  },
  {
    id: 2,
    from: "Lviv",
    to: "Warsaw",
    name: "Lviv → Warsaw",
    variants: [
      {
        id: "standard",
        label: "Standard",
        price: 600,
        duration: "10h"
      },
      {
        id: "comfort",
        label: "Comfort",
        price: 720,
        duration: "10h"
      },
      {
        id: "premium",
        label: "Premium",
        price: 850,
        duration: "10h"
      }
    ]
  },
  {
    id: 3,
    from: "Kyiv",
    to: "Lublin",
    name: "Kyiv → Lublin",
    variants: [
      {
        id: "standard",
        label: "Standard",
        price: 800,
        duration: "7h"
      },
      {
        id: "comfort",
        label: "Comfort",
        price: 950,
        duration: "7h"
      },
      {
        id: "premium",
        label: "Premium",
        price: 1100,
        duration: "7h"
      }
    ]
  }
];
