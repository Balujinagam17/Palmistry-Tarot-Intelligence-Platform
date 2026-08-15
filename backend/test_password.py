from app.database.postgres import SessionLocal
from app.models.user import User
from app.utils.password import verify_password

db = SessionLocal()

user = db.query(User).filter(User.email == "balu@example.com").first()

if user:
    print("User found")
    print("Email:", user.email)
    print("Stored Hash:", user.password)
    print("Password Verify:", verify_password("Password@123", user.password))
else:
    print("User not found")

db.close()