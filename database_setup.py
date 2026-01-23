import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="samWebbing#18",
    database="myproject"
)

cursor = db.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS domain_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(100),
    skills TEXT
)
""")

print("Table created!")
