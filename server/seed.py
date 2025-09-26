from app import create_app
from models import db, Category, Product, Inventory, Store, User, Role, SupplyRequest

app = create_app()
app.app_context().push()

# Clear existing data
db.drop_all()
db.create_all()

# -------------------------
# Roles
# -------------------------
admin_role = Role(name="Admin", description="Administrator")
merchant_role = Role(name="Merchant", description="Merchant")
clerk_role = Role(name="Clerk", description="Store Clerk")
db.session.add_all([admin_role, merchant_role, clerk_role])
db.session.commit()

# -------------------------
# Users
# -------------------------
admin_user = User(name="Admin User", email="admin@test.com", role_id=admin_role.role_id)
admin_user.set_password("password123")
db.session.add(admin_user)

merchant_user = User(name="Merchant One", email="merchant@test.com", role_id=merchant_role.role_id)
merchant_user.set_password("password123")
db.session.add(merchant_user)
db.session.commit()

# -------------------------
# Stores
# -------------------------
store1 = Store(name="Central Store")
store2 = Store(name="East Store")
db.session.add_all([store1, store2])
db.session.commit()

# -------------------------
# Categories
# -------------------------
categories = [
    Category(name="Electronics", description="Devices and gadgets"),
    Category(name="Groceries", description="Everyday essentials and food"),
    Category(name="Clothing", description="Wearables and fashion"),
]
db.session.add_all(categories)
db.session.commit()

# -------------------------
# Products
# -------------------------
products = [
    Product(name="Laptop", description="Gaming laptop", price=1200.0, category_id=categories[0].category_id),
    Product(name="Apple", description="Fresh apples", price=0.5, category_id=categories[1].category_id),
    Product(name="T-Shirt", description="Cotton T-Shirt", price=15.0, category_id=categories[2].category_id),
]
db.session.add_all(products)
db.session.commit()

# -------------------------
# Inventory
# -------------------------
inventory_items = [
    Inventory(product_id=products[0].product_id, quantity=10),
    Inventory(product_id=products[1].product_id, quantity=100),
    Inventory(product_id=products[2].product_id, quantity=50),
]
db.session.add_all(inventory_items)
db.session.commit()

# -------------------------
# Supply Requests
# -------------------------
supply_requests = [
    SupplyRequest(product_id=products[0].product_id, store_id=store1.id, quantity=5, requested_by=admin_user.user_id, status="pending"),
    SupplyRequest(product_id=products[1].product_id, store_id=store2.id, quantity=20, requested_by=merchant_user.user_id, status="approved"),
]
db.session.add_all(supply_requests)
db.session.commit()

print("✅ Database seeded successfully!")
