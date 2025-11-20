
-- 1. CREATE DATABASE

CREATE DATABASE IF NOT EXISTS food_ordering;
USE food_ordering;


-- 2. USERS TABLE (Registration + Login)

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. MENU TABLE (Your food items)

CREATE TABLE IF NOT EXISTS menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500)
);


-- 4. ORDERS TABLE (Stores order info)

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE
);


-- 5. ORDER ITEMS TABLE (Each food item in an order)

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_id INT NOT NULL,
    quantity INT NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) 
        ON DELETE CASCADE,
        
    FOREIGN KEY (menu_id) REFERENCES menu(id)
        ON DELETE CASCADE
);


-- 6. INSERT SAMPLE MENU DATA (OPTIONAL)

INSERT INTO menu (item_name, description, price, image_url)
VALUES
('Margherita Pizza', 'Classic cheese & tomato pizza', 299.00, 'images/pizza1.jpg'),
('Farmhouse Pizza', 'Veggies everywhere!', 399.00, 'images/pizza2.jpg'),
('Veg Burger', 'A delicious burger with fries', 149.00, 'images/burger.jpg'),
('Pasta Alfredo', 'Creamy white sauce pasta', 249.00, 'images/pasta.jpg'),
('Cold Coffee', 'Iced coffee with cream', 99.00, 'images/coffee.jpg');
