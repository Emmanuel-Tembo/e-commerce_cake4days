CREATE DATABASE CAKEFORDAYS;
USE CAKEFORDAYS;

-- USERS & ADMIN
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE admins (
--     admin_id INT PRIMARY KEY AUTO_INCREMENT,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) NOT NULL
-- );

-- PRODUCTS & VARIANTS
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    category VARCHAR(50) NULL,
    price DECIMAL(10,2) NOT NULL ,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255) NULL
);

CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(50),
    price_adjustment DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- CUSTOM ORDERS
CREATE TABLE custom_orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    event_type VARCHAR(50),
    event_date DATE,
    number_of_servings INT,
    budget_range VARCHAR(50),
    dietary_requirements TEXT,
    cake_type VARCHAR(50),
    preferred_flavours TEXT,
    special_requests TEXT,
    order_status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- PAYMENTS
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    payment_method VARCHAR(50),
    amount_paid DECIMAL(10,2),
    payment_status ENUM('paid', 'pending', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES custom_orders(order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- STANDARD ORDERS
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- SHOPPING CART
CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- REVIEWS
CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- REPORTS
CREATE TABLE sales_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    date_range_start DATE,
    date_range_end DATE,
    total_sales DECIMAL(10,2),
    total_orders INT,
    top_product_id INT,
    FOREIGN KEY (top_product_id) REFERENCES products(product_id)
);

-- INDEXES
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_custom_order_status ON custom_orders(order_status);


ALTER TABLE products
ADD COLUMN intended_audience ENUM('human', 'pet', 'POD') NOT NULL DEFAULT 'human';

UPDATE products
SET intended_audience = 'human'
WHERE product_id BETWEEN 1 AND 6;

UPDATE products
SET intended_audience = 'pet'
WHERE product_id BETWEEN 7 AND 10;

-- Insert 5 new cakes related to product_id=1 (Celebration Layer Cake)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Chocolate Celebration Cake', 'Rich chocolate layered cake perfect for special occasions.', 'human', 670.00, 15, 'human'),
('Vanilla Celebration Cake', 'Classic vanilla flavored cake with smooth frosting.', 'human', 660.00, 15, 'human'),
('Red Velvet Celebration Cake', 'Red velvet cake with cream cheese frosting.', 'human', 685.00, 10, 'human'),
('Lemon Zest Celebration Cake', 'Tangy lemon flavored layered cake.', 'human', 655.00, 12, 'human'),
('Carrot Nut Celebration Cake', 'Moist carrot cake with walnuts and spices.', 'human', 670.00, 13, 'human');

-- Insert 5 new cupcakes related to product_id=2 (Gourmet Frosted Cupcakes)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Strawberry Gourmet Cupcake', 'Fluffy cupcake topped with fresh strawberry frosting.', 'human', 68.00, 80, 'human'),
('Chocolate Gourmet Cupcake', 'Cupcake with rich chocolate frosting.', 'human', 69.00, 90, 'human'),
('Vanilla Bean Gourmet Cupcake', 'Cupcake infused with real vanilla beans.', 'human', 67.50, 100, 'human'),
('Salted Caramel Gourmet Cupcake', 'Cupcake topped with salted caramel frosting.', 'human', 70.00, 75, 'human'),
('Peanut Butter Gourmet Cupcake', 'Cupcake with peanut butter frosting.', 'human', 68.50, 85, 'human');

-- Insert 5 new macarons for product_id=3 (Assorted French Macarons)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Pistachio French Macaron', 'Delicate pistachio flavored macarons.', 'human', 35.00, 180, 'human'),
('Raspberry French Macaron', 'Sweet raspberry filled macarons.', 'human', 35.00, 170, 'human'),
('Chocolate French Macaron', 'Rich chocolate macarons with ganache filling.', 'human', 36.00, 160, 'human'),
('Vanilla French Macaron', 'Classic vanilla macarons.', 'human', 34.00, 190, 'human'),
('Lemon French Macaron', 'Tangy lemon macarons.', 'human', 34.50, 185, 'human');

-- Insert 5 new muffins for product_id=4 (Artisan Blueberry Muffins)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Blueberry Artisan Muffin', 'Fresh blueberry muffins made with artisan techniques.', 'human', 48.00, 110, 'human'),
('Banana Nut Artisan Muffin', 'Moist banana muffins with crunchy nuts.', 'human', 47.00, 105, 'human'),
('Chocolate Chip Artisan Muffin', 'Muffins with chocolate chips.', 'human', 49.00, 100, 'human'),
('Apple Cinnamon Artisan Muffin', 'Muffins with apple and cinnamon flavors.', 'human', 48.50, 95, 'human'),
('Lemon Poppyseed Artisan Muffin', 'Tangy lemon and poppyseed muffins.', 'human', 48.75, 90, 'human');

-- Insert 5 new scones for product_id=5 (Traditional English Scones)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Classic English Scone', 'Traditional scones perfect for tea time.', 'human', 38.50, 75, 'human'),
('Raisin English Scone', 'Scones with plump raisins.', 'human', 39.50, 70, 'human'),
('Cheese English Scone', 'Savory scones with cheese.', 'human', 40.00, 65, 'human'),
('Herb English Scone', 'Scones with fresh herbs.', 'human', 39.00, 60, 'human'),
('Cranberry English Scone', 'Scones with dried cranberries.', 'human', 40.25, 68, 'human');

-- Insert 5 new dessert sampler boxes for product_id=6 (Mini Dessert Sampler Box)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Assorted Mini Dessert Box', 'Box containing an assortment of mini desserts.', 'human', 75.00, 140, 'human'),
('Chocolate Lover Mini Box', 'Mini desserts with a chocolate focus.', 'human', 78.00, 130, 'human'),
('Fruit Lover Mini Box', 'Mini desserts featuring fresh fruits.', 'human', 76.50, 135, 'human'),
('Nutty Mini Dessert Box', 'Mini desserts with nuts.', 'human', 77.00, 125, 'human'),
('Classic Mini Dessert Box', 'Selection of classic mini desserts.', 'human', 75.50, 145, 'human');

-- Insert 5 new dog biscuits for product_id=7 (Crunchy Peanut Dog Biscuits)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Crunchy Peanut Butter Dog Biscuit', 'Dog biscuits made with peanut butter.', 'pet', 48.00, 280, 'pet'),
('Chicken Flavored Dog Biscuit', 'Crunchy biscuits with chicken flavor.', 'pet', 47.50, 290, 'pet'),
('Sweet Potato Dog Biscuit', 'Crunchy sweet potato dog treats.', 'pet', 46.50, 275, 'pet'),
('Beef Flavored Dog Biscuit', 'Dog biscuits with savory beef flavor.', 'pet', 48.50, 260, 'pet'),
('Cheese Flavored Dog Biscuit', 'Cheesy crunchy dog treats.', 'pet', 47.00, 270, 'pet');

-- Insert 5 new pupcakes for product_id=8 (Pumpkin Pupcakes for Dogs)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Pumpkin Pupcake', 'Mini pumpkin-flavored cupcakes for dogs.', 'pet', 57.00, 195, 'pet'),
('Carrot Pupcake', 'Carrot flavored mini cupcakes for dogs.', 'pet', 56.00, 190, 'pet'),
('Sweet Potato Pupcake', 'Sweet potato flavored cupcakes.', 'pet', 56.50, 185, 'pet'),
('Apple Cinnamon Pupcake', 'Apple cinnamon flavored cupcakes.', 'pet', 58.00, 180, 'pet'),
('Peanut Butter Pupcake', 'Peanut butter flavored cupcakes.', 'pet', 57.50, 175, 'pet');

-- Insert 5 new cat treats for product_id=9 (Soft Salmon Cat Treats)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Soft Salmon Cat Treat', 'Soft salmon flavored cat treats.', 'pet', 42.00, 240, 'pet'),
('Tuna Flavored Cat Treat', 'Tuna flavored soft cat treats.', 'pet', 41.50, 235, 'pet'),
('Chicken Flavored Cat Treat', 'Chicken flavored treats for cats.', 'pet', 41.75, 230, 'pet'),
('Beef Flavored Cat Treat', 'Beef flavored cat treats.', 'pet', 42.25, 225, 'pet'),
('Cheese Flavored Cat Treat', 'Cheese flavored soft treats.', 'pet', 42.50, 220, 'pet');

-- Insert 5 new cat birthday cakes for product_id=10 (Catnip Birthday Cake)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Catnip Birthday Cake', 'Special catnip birthday cake for cats.', 'pet', 85.00, 90, 'pet'),
('Tuna Topped Cat Birthday Cake', 'Birthday cake topped with tuna flakes.', 'pet', 84.00, 85, 'pet'),
('Salmon Topped Cat Birthday Cake', 'Birthday cake topped with salmon flakes.', 'pet', 86.00, 80, 'pet'),
('Cheese Topped Cat Birthday Cake', 'Birthday cake topped with cheese.', 'pet', 83.50, 75, 'pet'),
('Chicken Topped Cat Birthday Cake', 'Birthday cake topped with chicken.', 'pet', 84.50, 88, 'pet');

-- Variants for product_id 11 (Chocolate Celebration Cake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(1, 'Small (6-inch)', 0.00),
(1, 'Medium (8-inch)', 20.00),
(1, 'Large (10-inch)', 40.00),
(1, 'Extra Frosting', 10.00),
(1, 'Nuts Topping', 12.00);

-- Variants for product_id 12 (Vanilla Celebration Cake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(2, 'Small (6-inch)', 0.00),
(2, 'Medium (8-inch)', 18.00),
(2, 'Large (10-inch)', 38.00),
(2, 'Fruit Topping', 15.00),
(2, 'Chocolate Drizzle', 10.00);

-- Variants for product_id 13 (Red Velvet Celebration Cake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(3, 'Single Layer', 0.00),
(3, 'Double Layer', 25.00),
(3, 'Triple Layer', 50.00),
(3, 'Cream Cheese Frosting', 12.00),
(3, 'Extra Berries', 15.00);

-- Variants for product_id 14 (Lemon Zest Celebration Cake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(4, 'Small (6-inch)', 0.00),
(4, 'Medium (8-inch)', 20.00),
(4, 'Large (10-inch)', 40.00),
(4, 'Lemon Glaze', 8.00),
(4, 'Candied Lemon Peel', 10.00);

-- Variants for product_id 15 (Carrot Nut Celebration Cake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(5, 'Single Layer', 0.00),
(5, 'Double Layer', 22.00),
(5, 'Walnut Topping', 15.00),
(5, 'Cream Cheese Frosting', 10.00),
(5, 'Extra Carrots', 5.00);

-- Variants for product_id 16 (Strawberry Gourmet Cupcake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(6, 'Single', 0.00),
(6, 'Box of 6', 28.00),
(6, 'Box of 12', 55.00),
(6, 'Extra Frosting', 5.00),
(6, 'Sprinkles', 3.00);

-- Variants for product_id 17 (Chocolate Gourmet Cupcake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(7, 'Single', 0.00),
(7, 'Box of 6', 30.00),
(7, 'Box of 12', 58.00),
(7, 'Extra Frosting', 6.00),
(7, 'Nuts Topping', 4.00);

-- Variants for product_id 18 (Vanilla Bean Gourmet Cupcake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(8, 'Single', 0.00),
(8, 'Box of 6', 27.00),
(8, 'Box of 12', 54.00),
(8, 'Extra Vanilla', 5.50),
(8, 'Fruit Topping', 4.50);

-- Variants for product_id 19 (Salted Caramel Gourmet Cupcake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(9, 'Single', 0.00),
(9, 'Box of 6', 32.00),
(9, 'Box of 12', 60.00),
(9, 'Caramel Drizzle', 6.50),
(9, 'Sea Salt Sprinkle', 3.50);

-- Variants for product_id 20 (Peanut Butter Gourmet Cupcake)
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
(10, 'Single', 0.00),
(10, 'Box of 6', 29.00),
(10, 'Box of 12', 57.00),
(10, 'Extra Peanut Butter', 6.00),
(10, 'Chocolate Chips', 4.00);
