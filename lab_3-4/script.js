let buses = [
  { route: "Львів - Київ", driver: "Іван Петренко", seats: 50, price: 300 },
  { route: "Львів - Одеса", driver: "Олег Коваль", seats: 45, price: 500 },
  { route: "Львів - Ужгород", driver: "Микола Сидоренко", seats: 30, price: 200 },
  { route: "Львів - Варшава", driver: "Андрій Мельник", seats: 55, price: 700 }
];

let currentData = [...buses];


function renderTable(data = buses) {
  const table = document.getElementById("busTable");
  table.innerHTML = "";
  data.forEach((bus, index) => {
    table.innerHTML += `
      <tr>
        <td>${bus.route}</td>
        <td>${bus.driver}</td>
        <td>${bus.seats}</td>
        <td>${bus.price} грн</td>
        <td>
          <button onclick="editBus(${index})">✏️</button>
          <button onclick="deleteBus(${index})">🗑️</button>
        </td>
      </tr>
    `;
  });

  currentData = data;
  document.getElementById("seatResult").style.display = "none";
  document.getElementById("priceResult").style.display = "none";
}


function saveBus(event) {
  event.preventDefault();
  const route = document.getElementById("route").value.trim();
  const driver = document.getElementById("driver").value.trim();
  const seats = parseInt(document.getElementById("seats").value);
  const price = parseInt(document.getElementById("price").value);
  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    buses.push({ route, driver, seats, price });
  } else {
    buses[editIndex] = { route, driver, seats, price };
    document.getElementById("formTitle").textContent = "Додати автобус";
    document.getElementById("cancelEdit").style.display = "none";
  }

  document.getElementById("busForm").reset();
  document.getElementById("editIndex").value = "";
  renderTable(buses);
}


function editBus(index) {
  const bus = buses[index];
  document.getElementById("route").value = bus.route;
  document.getElementById("driver").value = bus.driver;
  document.getElementById("seats").value = bus.seats;
  document.getElementById("price").value = bus.price;
  document.getElementById("editIndex").value = index;

  document.getElementById("formTitle").textContent = "Редагувати автобус";
  document.getElementById("cancelEdit").style.display = "inline";
}


function cancelEditMode() {
  document.getElementById("busForm").reset();
  document.getElementById("formTitle").textContent = "Додати автобус";
  document.getElementById("editIndex").value = "";
  document.getElementById("cancelEdit").style.display = "none";
}


function deleteBus(index) {
  if (confirm("Видалити цей автобус?")) {
    buses.splice(index, 1);
    renderTable(buses);
  }
}


document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();
  const filtered = buses.filter(bus =>
    bus.route.toLowerCase().includes(value) ||
    bus.driver.toLowerCase().includes(value)
  );
  renderTable(filtered);
});


function sortBySeats() {
  buses.sort((a, b) => a.seats - b.seats);
  renderTable(buses);
}

function sortByPrice() {
  buses.sort((a, b) => a.price - b.price);
  renderTable(buses);
}


function countSeats() {
  const total = currentData.reduce((sum, bus) => sum + bus.seats, 0);
  const el = document.getElementById("seatResult");
  el.textContent = "Загальна кількість місць: " + total;
  el.style.display = "block";
}

function countTotalPrice() {
  const total = currentData.reduce((sum, bus) => sum + bus.price, 0);
  const el = document.getElementById("priceResult");
  el.textContent = "Загальна ціна всіх маршрутів: " + total + " грн";
  el.style.display = "block";
}


renderTable(buses);
