import bcrypt

password = "1234"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
print(f"Bcrypt hash for '{password}':")
print(hashed)
