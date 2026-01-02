from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import re

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "buses.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "seats": self.seats, "price": self.price}

# Функція для пошуку без урахування регістру та пробілів
def search_buses_by_name(buses, search_query):
    if not search_query:
        return buses
    
    # Очищаємо пошуковий запит
    cleaned_search = re.sub(r'\s+', ' ', search_query.strip()).lower()
    
    # Фільтруємо автобуси
    results = []
    for bus in buses:
        # Очищаємо назву автобуса
        bus_name_clean = re.sub(r'\s+', ' ', bus.name.strip()).lower()
        
        # Перевіряємо чи містить назва пошуковий запит
        if cleaned_search in bus_name_clean:
            results.append(bus)
    
    return results

@app.route('/')
def home():
    return render_template("index.html")

@app.route("/api/buses", methods=["GET"])
def get_buses():
    try:
        # Отримуємо параметри сортування та пошуку
        sort_by = request.args.get('sort_by', 'id')
        sort_order = request.args.get('sort_order', 'asc')
        search_query = request.args.get('search', '').strip()
        
        print(f"🔍 Отримано запит: sort_by={sort_by}, sort_order={sort_order}, search='{search_query}'")
        
        # Отримуємо всі автобуси з бази
        all_buses = Bus.query.all()
        print(f"📊 Всього автобусів в базі: {len(all_buses)}")
        
        # Застосовуємо пошук
        if search_query:
            buses = search_buses_by_name(all_buses, search_query)
            print(f"🔍 Після пошуку знайдено: {len(buses)} автобусів")
        else:
            buses = all_buses
        
        # Сортуємо результати
        if sort_by == 'seats':
            buses.sort(key=lambda x: x.seats, reverse=(sort_order.lower() == 'desc'))
        elif sort_by == 'price':
            buses.sort(key=lambda x: x.price, reverse=(sort_order.lower() == 'desc'))
        elif sort_by == 'name':
            buses.sort(key=lambda x: x.name, reverse=(sort_order.lower() == 'desc'))
        else:
            buses.sort(key=lambda x: x.id, reverse=(sort_order.lower() == 'desc'))
        
        print(f"✅ Відправлено автобусів: {len(buses)}")
        return jsonify([b.to_dict() for b in buses]), 200
        
    except Exception as e:
        print(f"❌ Помилка при отриманні автобусів: {e}")
        return jsonify({"error": "Помилка сервера"}), 500

@app.route("/api/buses", methods=["POST"])
def add_bus():
    try:
        data = request.get_json()
        print(f"📨 Отримані дані: {data}")
        
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        name = data.get("name")
        seats = data.get("seats")
        price = data.get("price")
        
        if not name or seats is None or price is None:
            return jsonify({"error": "Missing fields: name, seats, price are required"}), 400

        try:
            seats = int(seats)
            price = float(price)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid types for seats or price"}), 400

        bus = Bus(name=name, seats=seats, price=price)
        db.session.add(bus)
        db.session.commit()
        
        print(f"✅ Успішно додано автобус: {bus.to_dict()}")
        return jsonify(bus.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Помилка при додаванні автобуса: {e}")
        return jsonify({"error": "Database error", "details": str(e)}), 500

@app.route("/api/buses/<int:bus_id>", methods=["PUT"])
def update_bus(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({"error": "Bus not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get("name", bus.name)
    seats = data.get("seats", bus.seats)
    price = data.get("price", bus.price)

    try:
        seats = int(seats)
        price = float(price)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid types for seats or price"}), 400

    bus.name = name
    bus.seats = seats
    bus.price = price

    try:
        db.session.commit()
        return jsonify(bus.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

@app.route("/api/buses/<int:bus_id>", methods=["DELETE"])
def delete_bus(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({"error": "Bus not found"}), 404

    try:
        db.session.delete(bus)
        db.session.commit()
        return jsonify({"message": "Bus deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

def init_db():
    with app.app_context():
        db_path = os.path.join(BASE_DIR, "buses.db")
        if not os.path.exists(db_path):
            db.create_all()
            sample_buses = [
                Bus(name="Київ – Львів", seats=50, price=250.0),
                Bus(name="Одеса – Харків", seats=45, price=300.0),
                Bus(name="Луцьк – Рівне", seats=30, price=200.0),
                Bus(name="Дніпро – Запоріжжя", seats=25, price=150.0),
                Bus(name="Харків – Полтава", seats=60, price=180.0),
                Bus(name="Вінниця – Житомир", seats=40, price=120.0),
                Bus(name="Чернівці – Івано-Франківськ", seats=35, price=220.0),
                Bus(name="Запоріжжя – Кривий Ріг", seats=55, price=190.0),
            ]
            db.session.bulk_save_objects(sample_buses)
            db.session.commit()
            print("✅ База створена та наповнена тестовими даними.")
            
            # Перевіряємо, що дані дійсно додались
            bus_count = Bus.query.count()
            print(f"✅ Перевірка: у базі {bus_count} записів")
            buses = Bus.query.all()
            for bus in buses:
                print(f"   - {bus.name}")
        else:
            bus_count = Bus.query.count()
            print(f"✅ База вже існує. Знайдено {bus_count} записів.")

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)