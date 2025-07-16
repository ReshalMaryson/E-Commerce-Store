# 🛒 E-Commerce Store

A full-featured e-commerce store built using **React** for the frontend, **PHP OOP (Core PHP)** for the backend, and **MySQL** for the database.  
Includes features like a dynamic **shopping cart**, a robust **admin panel**, and **email support using PHPMailer**.


## 🚀 Features
- 🛍️ Product catalog with categories & search
- 🛒 Shopping cart (add, update, remove)
- 👨‍💼 Admin panel (manage products, orders, users)
- 📧 Email functionality using **PHPMailer**
- 🔐 Authentication (Login/Register)
- 🧑‍💻 Tech Stack: React + PHP OOP + MySQL


## 🧰 Tech Stack

| Frontend | Backend | Database | Email |
|----------|---------|----------|-------|
| React    | PHP (OOP) | MySQL  | PHPMailer |


### 🧪 How to Run Locally

### ⚛️ React Frontend Setup
1. Clone the repository:

    ```bash
    git clone https://github.com/ReshalMaryson/E-Commerce-Store.git
    cd E-Commerce-Store
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

    Your app will be running at:
    👉 http://localhost:3000

4. Make sure the backend (`/backend`) is also running on your local server  
   (via XAMPP or similar) so the frontend can access APIs.






### 🐘 PHP Backend Setup (Server)

1. Start your local server** (XAMPP or MAMP):
   - Make sure both **Apache** and **MySQL** are running.

2. Place the backend code inside your web root:
   - If you're using XAMPP on Windows, move the `backend/` folder into:
     ```
     C:/xampp/htdocs/
     
   - Final path should look like:
     ```
     C:/xampp/htdocs/backend/
     ```

3. Set up the database:
   - Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
   - Click **New** on the left to create a new database (`shopping_store`)
   - Select the new DB, go to the **Import** tab
   - Click **Choose File** and select:
     ```
     backend/ecommerce_store_schema.sql
     ```
   - Click **Go** to import tables and sample data

4. Database connection is handled in this file:

    ```
    backend/config/db.php
    ```

   Here’s how the connection works (already set for XAMPP):

    ```php PDO connetion String
    $this->conn = new PDO("mysql:host=localhost;dbname=shopping_store;", "root", "");
    ```

   - If you use different credentials or DB name, update them here.

5. **Visit the backend in your browser**:
   - Assuming your backend folder is `backend/`, go to:
     ```
     http://localhost/backend/public/
     ```

   You should see the working API or homepage depending on your setup.

---

✅ **PHPMailer is already integrated**.  
Skip to the next section for PHPMailer setup instructions.  

