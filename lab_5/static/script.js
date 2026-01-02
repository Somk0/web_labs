const API_URL = "http://127.0.0.1:5000/api/buses";
let editingId = null;
let currentSort = { by: 'id', order: 'asc' };
let currentSearch = '';

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Запуск додатку...");
    fetchBuses();
    
    document.getElementById("saveBtn").addEventListener("click", addOrUpdateBus);
    document.getElementById("searchBtn").addEventListener("click", searchBus);
    document.getElementById("resetBtn").addEventListener("click", resetSearch);
    document.getElementById("countSeatsBtn").addEventListener("click", countSeats);
    document.getElementById("countPricesBtn").addEventListener("click", countPrices);
    
    document.getElementById("search").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            searchBus();
        }
    });
});

async function fetchBuses() {
    try {
        showLoading(true);
        
        const params = new URLSearchParams();
        if (currentSort.by !== 'id') {
            params.append('sort_by', currentSort.by);
            params.append('sort_order', currentSort.order);
        }
        if (currentSearch) {
            params.append('search', currentSearch);
        }
        
        const url = `${API_URL}?${params.toString()}`;
        console.log("📡 Запит до сервера:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const buses = await response.json();
        console.log("✅ Отримано автобусів:", buses.length);
        renderTable(buses);
        
        
    } catch (error) {
        console.error("❌ Помилка при завантаженні:", error);
        showError("Не вдалося завантажити дані");
    } finally {
        showLoading(false);
    }
}

function searchBus() {
    currentSearch = document.getElementById("search").value.trim();
    console.log("🔍 Пошук за:", currentSearch);
    fetchBuses();
}

function resetSearch() {
    currentSearch = '';
    document.getElementById("search").value = '';
    
    document.getElementById("priceCount").textContent = '';
    fetchBuses();
}

function sortBuses(sortBy, sortOrder) {
    currentSort = { by: sortBy, order: sortOrder };
    fetchBuses();
}

function resetSort() {
    currentSort = { by: 'id', order: 'asc' };
    fetchBuses();
}



function renderTable(buses) {
    const table = document.getElementById("busTable");
    
    if (buses.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" class="no-data">
                    🚫 Маршрутів не знайдено
                    ${currentSearch ? `за запитом "${currentSearch}"` : ''}
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    buses.forEach(bus => {
        html += `
            <tr>
                <td><strong>${bus.name}</strong></td>
                <td>${bus.seats}</td>
                <td>${bus.price.toFixed(2)} грн</td>
                <td class="actions">
                    <button onclick="editBus(${bus.id})" class="btn-edit">✏️</button>
                    <button onclick="deleteBus(${bus.id})" class="btn-delete">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    table.innerHTML = html;
}

async function addOrUpdateBus() {
    const name = document.getElementById("busName").value.trim();
    const seats = parseInt(document.getElementById("seats").value);
    const price = parseFloat(document.getElementById("price").value);

    if (!name) {
        showError("Введіть назву маршруту");
        return;
    }
    if (isNaN(seats) || seats <= 0) {
        showError("Введіть коректну кількість місць");
        return;
    }
    if (isNaN(price) || price <= 0) {
        showError("Введіть коректну ціну");
        return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, seats, price })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            clearForm();
            await fetchBuses();
            showSuccess(editingId ? "Маршрут оновлено!" : "Маршрут додано!");
        } else {
            showError(result.error || "Сталася помилка");
        }
    } catch (error) {
        console.error("❌ Помилка:", error);
        showError("Мережева помилка");
    }
}

async function editBus(id) {
    try {
        const response = await fetch(API_URL);
        const buses = await response.json();
        const bus = buses.find(b => b.id === id);

        if (!bus) {
            showError("Автобус не знайдено");
            return;
        }

        document.getElementById("busName").value = bus.name;
        document.getElementById("seats").value = bus.seats;
        document.getElementById("price").value = bus.price;
        editingId = id;
        document.getElementById("saveBtn").textContent = "Оновити автобус";
        
        document.getElementById("busName").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("❌ Помилка:", error);
        showError("Помилка при редагуванні");
    }
}

async function deleteBus(id) {
    if (!confirm("Ви впевнені, що хочете видалити цей маршрут?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: "DELETE" 
        });
        
        if (response.ok) {
            await fetchBuses();
            showSuccess("Маршрут видалено!");
        } else {
            const error = await response.json();
            showError(error.error || "Помилка при видаленні");
        }
    } catch (error) {
        console.error("❌ Помилка:", error);
        showError("Мережева помилка");
    }
}

function clearForm() {
    document.getElementById("busName").value = "";
    document.getElementById("seats").value = "";
    document.getElementById("price").value = "";
    editingId = null;
    document.getElementById("saveBtn").textContent = "Додати автобус";
}

function showLoading(show) {
    const table = document.getElementById("busTable");
    if (show) {
        table.innerHTML = '<tr><td colspan="4" class="loading">⏳ Завантаження...</td></tr>';
    }
}

function showError(message) {
    alert(`❌ ${message}`);
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}

function countSeats() {
    const rows = document.querySelectorAll("#busTable tr");
    if (rows.length === 0 || rows[0].querySelector('.no-data, .loading')) {
        document.getElementById("priceCount").textContent = "Немає даних для підрахунку";
        return;
    }
    
    const total = Array.from(rows).reduce((sum, row) => {
        return sum + parseInt(row.cells[1].textContent);
    }, 0);
    
    document.getElementById("priceCount").textContent = `📍 Загальна кількість місць: ${total}`;
}

function countPrices() {
    const rows = document.querySelectorAll("#busTable tr");
    if (rows.length === 0 || rows[0].querySelector('.no-data, .loading')) {
        document.getElementById("priceCount").textContent = "Немає даних для підрахунку";
        return;
    }
    
    const total = Array.from(rows).reduce((sum, row) => {
        return sum + parseFloat(row.cells[2].textContent);
    }, 0);
    
    document.getElementById("priceCount").textContent = `💰 Загальна сума цін: ${total.toFixed(2)} грн`;
}