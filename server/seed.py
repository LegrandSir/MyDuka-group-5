from app import create_app
from models import db, Category, Product, Inventory, Store, User, Role, SupplyRequest, Payment, PasswordResetToken
from datetime import datetime


app = create_app()
app.app_context().push()

# Clear existing data
db.drop_all()
db.create_all()

# -------------------------
# Roles
# -------------------------
admin_role = Role(name="admin", description="Administrator")
merchant_role = Role(name="merchant", description="Merchant")
clerk_role = Role(name="clerk", description="Clerk")

db.session.add_all([admin_role, merchant_role, clerk_role])
db.session.commit()


# -------------------------
# Users
# -------------------------
admin_user = User(name="Admin User", email="admin@gmail.com", role_id=admin_role.role_id)
admin_user.set_password("StrongPass123!")
db.session.add(admin_user)

merchant_user = User(name="Merchant One", email="merchant@gmail.com", role_id=merchant_role.role_id)
merchant_user.set_password("StrongPass123!")
db.session.add(merchant_user)
db.session.commit()

merchant_user = User(name="Faith Wangari", email="faithwangarimerchant@gmail.com", role_id=merchant_role.role_id)
merchant_user.set_password("StrongPass123!")
db.session.add(merchant_user)
db.session.commit()

merchant_user = User(name="Paul Wafula", email="paulwafulamerchant@gmail.com", role_id=merchant_role.role_id)
merchant_user.set_password("StrongPass123!")
db.session.add(merchant_user)
db.session.commit()

clerk_user = User(name="Ellis Lunayo", email="ellislunayoclerk@gmail.com", role_id=clerk_role.role_id)
clerk_user.set_password("StrongPass123!")
db.session.add(clerk_user)
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

# -------------------------
# Payments 
# -------------------------
payments = [
    Payment(user_id=merchant_user.user_id, amount=250.00, status="completed", method="M-Pesa"),
    Payment(user_id=merchant_user.user_id, amount=100.00, status="pending", method="Card"),
]
db.session.add_all(payments)
db.session.commit()

# -------------------------
# Password Reset Tokens 
# -------------------------
reset_token = PasswordResetToken(
    user_id=admin_user.user_id,
    token="dummy-reset-token-123",
    expires_at=datetime.utcnow(),
)
db.session.add(reset_token)
db.session.commit()

print("✅ Database seeded successfully!")
