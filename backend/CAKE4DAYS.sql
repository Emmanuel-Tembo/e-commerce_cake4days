-- DATABASE SETUP-
CREATE DATABASE CAKEFORDAYS;
USE CAKEFORDAYS;

-- USERS
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD reset_token VARCHAR(255) NULL,
ADD reset_token_expiry DATETIME NULL;
ALTER TABLE users MODIFY reset_token_expiry BIGINT;

-- ALTER TABLE users
-- ADD reset_token VARCHAR(255) NULL,
-- ADD reset_token_expiry DATETIME NULL;

ALTER TABLE users MODIFY reset_token_expiry BIGINT;
INSERT INTO users (user_id, username, password_hash, email) VALUES (1, 'SampleUser', 'hashed_password_placeholder', 'sampleuser@example.com');

-- PRODUCTS
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    intended_audience ENUM('human', 'pet', 'POD') NOT NULL DEFAULT 'human'
);

ALTER TABLE products
MODIFY intended_audience ENUM('human', 'pet', 'POD') NOT NULL DEFAULT 'human';
ALTER TABLE products ADD COLUMN is_on_sale BOOLEAN NOT NULL DEFAULT FALSE;

-- Adds new columns for the additional product details
ALTER TABLE products
ADD COLUMN serves INT,
ADD COLUMN preparation_time VARCHAR(50),
ADD COLUMN allergens TEXT;

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(50),
    price_adjustment DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- UNIFIED ORDERS TABLE
-- This table now handles both standard and custom orders.
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, -- Can be NULL for guest checkouts
    order_type ENUM('standard', 'custom') NOT NULL DEFAULT 'standard',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_id INT, -- Link to shipping details table
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

ALTER TABLE orders
ADD COLUMN order_number VARCHAR(50) UNIQUE;

-- ORDER ITEMS (links standard products to orders)
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

ALTER TABLE orders
MODIFY COLUMN status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending';

ALTER TABLE orders
DROP COLUMN shipping_id;

ALTER TABLE shipping_details
ADD user_id INT,
ADD CONSTRAINT fk_user_shipping FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;


-- CUSTOM ORDER DETAILS
-- This table stores the specific details only for custom orders.
CREATE TABLE custom_order_details (
    custom_order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    event_type VARCHAR(50),
    event_date DATE,
    number_of_servings INT,
    budget_range VARCHAR(50),
    dietary_requirements TEXT,
    cake_type VARCHAR(50),
    preferred_flavours TEXT,
    special_requests TEXT,
    inspiration_image_url VARCHAR(255),
    FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON DELETE SET NULL
);

-- NEW SHIPPING DETAILS (per-order shipping information)
CREATE TABLE shipping_details (
    shipping_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    delivery_method ENUM('collection', 'delivery') NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- PAYMENTS
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method VARCHAR(50),
    amount_paid DECIMAL(10,2),
    payment_status ENUM('paid', 'pending', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- SHOPPING CART
CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE shopping_cart
MODIFY user_id INT NULL;


-- CART ITEMS
CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- REVIEWS
CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- SALES REPORTS
CREATE TABLE sales_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    date_range_start DATE,
    date_range_end DATE,
    total_sales DECIMAL(10,2),
    total_orders INT,
    top_product_id INT,
    FOREIGN KEY (top_product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- USER ADDRESSES
CREATE TABLE user_addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- WISHLISTS
CREATE TABLE wishlists (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_audience ON products(intended_audience);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_sales_reports_top_product_id ON sales_reports(top_product_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX idx_custom_order_details_order_id ON custom_order_details(order_id);
CREATE INDEX idx_shipping_details_order_id ON shipping_details(order_id);


-- products:
INSERT INTO products (name, category, price, image_url, intended_audience) VALUES
('Birthday Bone Cake', 'Dog Cakes', 300.00, 'https://www.cakesforpets.fr/cdn/shop/files/GateauOSAnniversairebleuensemble.jpg?v=1740342583&width=360', 'pet'),
('Peanut Butter Pupcake', 'Dog Cakes', 250.00, 'https://i0.wp.com/still-busy-baking.ca/wp-content/uploads/2024/03/DSC02147-1024x684.jpg?ssl=1', 'pet'),
('Tuna Celebration Cake', 'Cat Cakes', 350.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3phTn8M5Qo6c3bJvHkwkE8N5HqL6dR_DQ0Q&s', 'pet'),
('Carrot & Honey Dog Cake', 'Dog Cakes', 500.00, 'https://www.obsessivecooking.com/wp-content/uploads/2023/05/carrot-banana-dog-fox-cake-2-1200.jpg', 'pet'),
('Millet Seed Cake', 'Bird Cakes', 200.00, NULL, 'pet'),
('Bacon Birthday Cake', 'Dog Cakes', 250.00, NULL, 'pet'),
('Salmon Kitty Cake', 'Cat Cakes', 500.00, 'https://www.allrecipes.com/thmb/Os1uL1-9PAkhAC8qXPksBUQEt6k=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-265170-birthday-cake-for-your-cat-DDMFS-4x3-Beauty-6aa665121db148d0ae60b741551f8fe5.jpg', 'pet'),
('Sweet Potato Celebration', 'Dog Cakes', 480.00, 'https://www.cakesforpets.fr/cdn/shop/files/CakeetDonutsAnniversaireroseboite.jpg?v=1745331300&width=360', 'pet'),
('Cat Training Cake', 'Training Cakes', 308.00, 'https://www.cakesforpets.fr/cdn/shop/files/friandisepoissonsaumonbetterave.jpg?v=1744831815&width=360', 'pet'),
('Apple Cinnamon Pup Cake', 'Dog Cakes', 220.00, 'https://www.cakesforpets.fr/cdn/shop/files/friandisedemispherepouletcarotte.jpg?v=1744831742&width=360', 'pet'),
('Catnip Dream Cake', 'Cat Cakes', 157.00, 'https://www.cakesforpets.fr/cdn/shop/files/BonbonnieresFriandises3.jpg?v=1740343109&width=360', 'pet'),
('Fruit & Nut Bird Cake', 'Bird Cakes', 567.00, 'https://www.cakesforpets.fr/cdn/shop/files/Biscuitpommebananepourchien.jpg?v=1740589320&width=360', 'pet'),
('Liver & Cheese Cake', 'Dog Cakes', 234.00, 'https://www.cakesforpets.fr/cdn/shop/files/friandisemadelainesaumonbetterave.jpg?v=1740345692&width=360', 'pet'),
('Mini Training Cupcakes', 'Training Cakes', 345.00, 'https://example.com/mini-training-cupcakes.jpg', 'pet'),
('Mackerel Party Cake', 'Cat Cakes', 187.00, 'https://www.cakesforpets.fr/cdn/shop/files/rriandisegaufreboeufcourgette.jpg?v=1740345581&width=360', 'pet'),
('Pumpkin Spice Pup Cake', 'Dog Cakes', 345.00, 'https://www.cakesforpets.fr/cdn/shop/files/IMG_0868.jpg?v=1745321700&width=493', 'pet'),
('Vanilla Birthday Cake', 'Dog Cakes', 250.00, 'https://www.cakesforpets.fr/cdn/shop/files/IMG_0882.jpg?v=1744744091&width=493', 'pet'),
('Fish Fiesta Cake', 'Cat Cakes', 200.00, 'https://www.cakesforpets.fr/cdn/shop/files/pattechienrose.png?v=1742934678&width=493', 'pet'),
('Coconut Bird Cake', 'Bird Cakes', 180.00, 'https://www.cakesforpets.fr/cdn/shop/files/Boxe_Patisseries_Donuts_Patte_de_Chien_animal.jpg?v=1745872623&width=823', 'pet'),
('Beef & Veggie Cake', 'Dog Cakes', 125.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8fWgXGOGQGUOWfsgu7rxfNvw0QUUNfQmquNjZrsEvGoO5eyDB4kEzB2HB7r_SjxOcxRQ&usqp=CAU', 'pet'),
('Chocolate Delight', 'birthday', 25.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Classic-Chocolate.jpg', 'human'),
('Vanilla Dream', 'wedding', 30.00, 'https://tessasbakery.co.za/wp-content/uploads/2024/08/Untitled-design-3.png', 'human'),
('Red Velvet Bliss', 'custom', 28.50, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Red-Velvet-1024x1024.jpg', 'human'),
('Lemon Zest', 'seasonal', 22.00, 'https://tessasbakery.co.za/wp-content/uploads/2015/06/New_Lemon_Mer-1-700x700.jpg', 'human'),
('Carrot Crunch', 'mini', 18.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVYxJDv7lEsZ3agTTeULKWi3P3NZ1Me4wg-g&s', 'human'),
('Carrot Cheese', 'birthday', 26.00, NULL, 'human'),
('Blue Velvet', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Blue-Velvet-Cakes-700x700.jpg', 'human'),
('Chai Latte Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Chai_Cake-700x700.jpg', 'human'),
('Chocolate Caramel Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_ChocCar-700x700.jpg', 'human'),
('Death By Chocolate Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Death-by-Chocolate-700x700.jpg', 'human'),
('Let It Go', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2017/04/4-1-700x700.png', 'human'),
('Dusty Rose', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-DUSTYROSE-1-700x700.jpg', 'human'),
('Blush Pink Fun-Size', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-FUNSIZE-PINK-700x700.jpg', 'human'),
('Mini Lunchbox', 'birthday', 26.00, NULL, 'human'),
('Pink Rose Cascade Cake', 'birthday', 26.00, 'https://ohmycake.co.za/wp-content/uploads/2024/04/Pink-rose-cascade-cake-768x768.jpg', 'human'),
('Sprinkle Baby Gift Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-10.png', 'human'),
('Oreo Mini Gift Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-5-1-700x700.png', 'human'),
('Nutella Mini Gift Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2024/07/Untitled-design.zip-7-1-700x700.png', 'human'),
('Vegan Oreo Cake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/New_Vegan_Oreo-700x700.jpg', 'human'),
('Orea New York Baked CheeseCake', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2024/09/Untitled-design.zip-3-1-669x669.png', 'human'),
('Unicorn Fun Size', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2022/07/NEW-FUNSIZE-UNICORNS-700x700.jpg', 'human'),
('Strawberry Fun Size', 'birthday', 26.00, 'https://tessasbakery.co.za/wp-content/uploads/2025/07/New-Product-Shots-Products-6.png', 'human');
-- Insert 5 new cakes related to product_id=1 (Celebration Layer Cake)
INSERT INTO products (name, description, category, price, stock_quantity, intended_audience)
VALUES
('Chocolate Celebration Cake', 'Rich chocolate layered cake perfect for special occasions.', 'human', 670.00, 15, 'human'),
('Vanilla Celebration Cake', 'Classic vanilla flavored cake with smooth frosting.', 'human', 660.00, 15, 'human'),
('Red Velvet Celebration Cake', 'Red velvet cake with cream cheese frosting.', 'human', 685.00, 10, 'human'),
('Lemon Zest Celebration Cake', 'Tangy lemon flavored layered cake.', 'human', 655.00, 12, 'human'),
('Carrot Nut Celebration Cake', 'Moist carrot cake with walnuts and spices.', 'human', 670.00, 13, 'human');

-- Insert the new merch products into the `products` table
-- The 'intended_audience' for these will be 'POD'
-- The 'is_on_sale' column will be set to TRUE (1) or FALSE (0)
INSERT INTO products (name, description, category, price, image_url, intended_audience, is_on_sale) VALUES
('Paw Print T-Shirt', 'Comfortable cotton t-shirt with cute paw print design', 'Apparel', 249.99, 'https://img.kwcdn.com/product/open/00db427a76f44f25a7a114ba4bc3c237-goods.jpeg?imageView2/2/w/800/q/70/format/webp', 'POD', 1),
('Pet Lover Mug', 'Ceramic mug with "Dog Mom/Dad" text and bone design', 'Home', 149.99, 'https://dogmom.co.za/wp-content/uploads/2022/12/Dog-Mother-Coffee-Lover-Mug-Front-1.jpg.webp', 'POD', 0),
('Pet Bandana', 'Adjustable cotton bandana for your furry friend', 'Accessories', 99.99, 'https://img.kwcdn.com/product/fancy/172814aa-b49f-4713-906f-b5f2573c5036.jpg?imageView2/2/w/800/q/70/format/webp', 'POD', 0),
('Pet Portrait Pillow', 'Customizable pillow with your pet''s portrait', 'Home', 349.99, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQSixsYOxEeffT_pJtXGafl8ZU0hpES0MCrrm1fey_qWW_59ZIF-0CC-9sdfcTnMJdwRtNJYpjZPEDQPR-O2N6DzfdBB0qQ5j6tifsmgJH8nA41qwpfc5GpQBdRIHr12PZLL-ng88GhKg&usqp=CAc', 'POD', 1),
('Dog Paw Socks', 'Comfy socks with cute dog paw designs', 'Apparel', 129.99, 'https://media.takealot.com/covers_images/01b1057dbeed4a1180e799aaf017ccb5/s-zoom.file', 'POD', 0),
('Pet Memorial Keychain', 'Beautiful keychain to remember your beloved pet', 'Gifts', 79.99, 'https://d2j6dbq0eux0bg.cloudfront.net/images/49036762/4785369027.jpg', 'POD', 0),
('Pet Memorial Keychain', 'Beautiful keychain to remember your beloved pet', 'Gifts', 79.99, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQZ3QOI84rNuhFVinX9NZkuXuGpqPK4drPNDl1QJJzRWK9iEZH9ZYsjnBXF57X-hZNVEXLUxTLpBetGhyd4UpjMy2N3qd2f-cw2py5DFITORX0LpUdEXPWNvQ&usqp=CAc', 'POD', 0),
('Paw Print T-Shirt', 'Comfortable cotton t-shirt with cute paw print design', 'Apparel', 249.99, 'https://img.kwcdn.com/thumbnail/s/836cea6daa36cb4973136ef9fc34d118_547e7d45ef97.jpg?imageView2/2/w/800/q/70/format/webp', 'POD', 1),
('Pet Bandana', 'Adjustable cotton bandana for your furry friend', 'Accessories', 99.99, 'https://img.ltwebstatic.com/images3_pi/2024/09/02/aa/1725259643dde33bbfa3200390b3dccc145c434aa1_thumbnail_560x.webp', 'POD', 0);

-- updates
-- Pet Cakes
UPDATE products SET serves = 1, preparation_time = '2 hours', allergens = 'Contains meat, wheat' WHERE product_id = 1;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains nuts, wheat' WHERE product_id = 2;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains fish' WHERE product_id = 3;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains honey' WHERE product_id = 4;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains nuts, seeds' WHERE product_id = 5;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains pork' WHERE product_id = 6;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains fish' WHERE product_id = 7;
UPDATE products SET serves = 1, preparation_time = '2 hours', allergens = 'Contains sweet potato' WHERE product_id = 8;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains fish, chicken' WHERE product_id = 9;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains apple, cinnamon' WHERE product_id = 10;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains catnip' WHERE product_id = 11;
UPDATE products SET serves = 1, preparation_time = '2 hours', allergens = 'Contains fruit, nuts' WHERE product_id = 12;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains liver, dairy' WHERE product_id = 13;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'None' WHERE product_id = 14;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains fish' WHERE product_id = 15;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains pumpkin' WHERE product_id = 16;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'None' WHERE product_id = 17;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains fish' WHERE product_id = 18;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains coconut' WHERE product_id = 19;
UPDATE products SET serves = 1, preparation_time = '1.5 hours', allergens = 'Contains beef' WHERE product_id = 20;

---

### Human Cakes

UPDATE products SET serves = 8, preparation_time = '2 hours', allergens = 'Contains nuts, dairy' WHERE product_id = 21;
UPDATE products SET serves = 10, preparation_time = '4 hours', allergens = 'Contains gluten, eggs, dairy' WHERE product_id = 22;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, eggs, dairy' WHERE product_id = 23;
UPDATE products SET serves = 6, preparation_time = '1 hour', allergens = 'Contains gluten, eggs, dairy' WHERE product_id = 24;
UPDATE products SET serves = 4, preparation_time = '1.5 hours', allergens = 'Contains nuts, gluten, eggs, dairy' WHERE product_id = 25;
UPDATE products SET serves = 10, preparation_time = '2 hours', allergens = 'Contains dairy, eggs, gluten' WHERE product_id = 26;
UPDATE products SET serves = 12, preparation_time = '2.5 hours', allergens = 'Contains dairy, eggs, gluten' WHERE product_id = 27;
UPDATE products SET serves = 10, preparation_time = '2 hours', allergens = 'Contains dairy, eggs, gluten' WHERE product_id = 28;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains dairy, eggs, gluten' WHERE product_id = 29;
UPDATE products SET serves = 15, preparation_time = '3.5 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 30;
UPDATE products SET serves = 10, preparation_time = '2 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 31;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 32;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains gluten, dairy' WHERE product_id = 33;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains gluten, dairy' WHERE product_id = 34;
UPDATE products SET serves = 15, preparation_time = '4 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 35;
UPDATE products SET serves = 2, preparation_time = '1.5 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 36;
UPDATE products SET serves = 2, preparation_time = '1.5 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 37;
UPDATE products SET serves = 2, preparation_time = '1.5 hours', allergens = 'Contains nuts, gluten, dairy' WHERE product_id = 38;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'None (vegan)' WHERE product_id = 39;
UPDATE products SET serves = 10, preparation_time = '4 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 40;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains gluten, dairy' WHERE product_id = 41;
UPDATE products SET serves = 1, preparation_time = '1 hour', allergens = 'Contains gluten, dairy' WHERE product_id = 42;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 43;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 44;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 45;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains gluten, dairy' WHERE product_id = 46;
UPDATE products SET serves = 12, preparation_time = '3 hours', allergens = 'Contains nuts, gluten, dairy' WHERE product_id = 47;

-- Insert the product variants for the items that have sizes or colors
-- Note: We are using a simple `variant_name` and a `price_adjustment` of 0.00
-- This assumes all sizes/colors for a single product have the same price
INSERT INTO product_variants (product_id, variant_name, price_adjustment) VALUES
-- Variants for 'Paw Print T-Shirt'
((SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND image_url LIKE '%00db427a76f44f25a7a114ba4bc3c237-goods.jpeg%' LIMIT 1), 'S', 0.00),
((SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND image_url LIKE '%00db427a76f44f25a7a114ba4bc3c237-goods.jpeg%' LIMIT 1), 'M', 0.00),
((SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND image_url LIKE '%00db427a76f44f25a7a114ba4bc3c237-goods.jpeg%' LIMIT 1), 'L', 0.00),
((SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND image_url LIKE '%00db427a76f44f25a7a114ba4bc3c237-goods.jpeg%' LIMIT 1), 'XL', 0.00),

-- Variants for 'Pet Bandana'
((SELECT product_id FROM products WHERE name = 'Pet Bandana' AND image_url LIKE '%172814aa-b49f-4713-906f-b5f2573c5036.jpg%' LIMIT 1), 'Red', 0.00),
((SELECT product_id FROM products WHERE name = 'Pet Bandana' AND image_url LIKE '%172814aa-b49f-4713-906f-b5f2573c5036.jpg%' LIMIT 1), 'Blue', 0.00),
((SELECT product_id FROM products WHERE name = 'Pet Bandana' AND image_url LIKE '%172814aa-b49f-4713-906f-b5f2573c5036.jpg%' LIMIT 1), 'Green', 0.00),
((SELECT product_id FROM products WHERE name = 'Pet Bandana' AND image_url LIKE '%172814aa-b49f-4713-906f-b5f2573c5036.jpg%' LIMIT 1), 'Grey', 0.00),

-- Variants for 'Dog Paw Socks'
((SELECT product_id FROM products WHERE name = 'Dog Paw Socks' AND image_url LIKE '%01b1057dbeed4a1180e799aaf017ccb5/s-zoom.file%' LIMIT 1), 'S/M', 0.00),
((SELECT product_id FROM products WHERE name = 'Dog Paw Socks' AND image_url LIKE '%01b1057dbeed4a1180e799aaf017ccb5/s-zoom.file%' LIMIT 1), 'L/XL', 0.00);

-- POD



-- REVIEWS:
-- Insert review data for a mix of cakes and merch products
-- Note: The user_id is set to 1. Ensure a user with this ID exists in your users table.

-- Reviews for 'Birthday Bone Cake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Birthday Bone Cake' LIMIT 1), 5, 'My dog absolutely loved this cake! It was a perfect birthday treat and looked great.'),
(1, (SELECT product_id FROM products WHERE name = 'Birthday Bone Cake' LIMIT 1), 5, 'It was a huge hit with my furry friend. The size was perfect and the bone decoration was adorable.'),
(1, (SELECT product_id FROM products WHERE name = 'Birthday Bone Cake' LIMIT 1), 4, 'Very good, my dog enjoyed it. The cake was a bit small for the price, but the quality was great.');

-- Reviews for 'Peanut Butter Pupcake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Peanut Butter Pupcake' LIMIT 1), 5, 'Highly recommend! My pup devoured it in minutes. Such a fun treat.'),
(1, (SELECT product_id FROM products WHERE name = 'Peanut Butter Pupcake' LIMIT 1), 4, 'Great taste and texture, my dog was very happy. Fast shipping too!');

-- Reviews for 'Tuna Celebration Cake' (Cat Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Tuna Celebration Cake' LIMIT 1), 3, 'My cat was a little hesitant at first, but eventually ate it. It smells very strongly of tuna.'),
(1, (SELECT product_id FROM products WHERE name = 'Tuna Celebration Cake' LIMIT 1), 5, 'My picky cat loved it! This is a rare find for us. I''m so happy she enjoyed her birthday cake.'),
(1, (SELECT product_id FROM products WHERE name = 'Tuna Celebration Cake' LIMIT 1), 4, 'Good quality and looks exactly like the picture. My cat ate the whole thing.');

-- Reviews for 'Carrot & Honey Dog Cake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Carrot & Honey Dog Cake' LIMIT 1), 5, 'My dog has a sensitive stomach, but this cake was perfect. No issues and she loved the taste.'),
(1, (SELECT product_id FROM products WHERE name = 'Carrot & Honey Dog Cake' LIMIT 1), 5, 'The best dog cake we have ever bought. The ingredients are simple and my dog finds them delicious.');

-- Reviews for 'Salmon Kitty Cake' (Cat Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Salmon Kitty Cake' LIMIT 1), 5, 'My cat is obsessed with this cake. Will definitely be buying again for her next birthday!'),
(1, (SELECT product_id FROM products WHERE name = 'Salmon Kitty Cake' LIMIT 1), 4, 'A solid choice for any cat lover. It was a little bit messy to serve, but my cat did not mind.');

-- Reviews for 'Cat Training Cake' (Training Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Cat Training Cake' LIMIT 1), 2, 'Did not work for us. My cat showed no interest.'),
(1, (SELECT product_id FROM products WHERE name = 'Cat Training Cake' LIMIT 1), 4, 'Great idea, works well for training sessions. The portion sizes are good.'),
(1, (SELECT product_id FROM products WHERE name = 'Cat Training Cake' LIMIT 1), 3, 'My cat liked it, but it''s not as special as the other cakes.');

-- Reviews for 'Catnip Dream Cake' (Cat Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Catnip Dream Cake' LIMIT 1), 5, 'This cake is a hit! My cat went crazy for the catnip. It was so much fun to watch.'),
(1, (SELECT product_id FROM products WHERE name = 'Catnip Dream Cake' LIMIT 1), 5, 'Fantastic product, great price. My cat had a blast!'),
(1, (SELECT product_id FROM products WHERE name = 'Catnip Dream Cake' LIMIT 1), 5, 'A truly great cake for a cat who loves catnip.'),
(1, (SELECT product_id FROM products WHERE name = 'Catnip Dream Cake' LIMIT 1), 5, 'This cake is a 10/10 for my cat. I would give it 6 stars if I could.'),
(1, (SELECT product_id FROM products WHERE name = 'Catnip Dream Cake' LIMIT 1), 5, 'It was perfect! My cat had the best time with her birthday cake.');

-- Reviews for 'Liver & Cheese Cake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Liver & Cheese Cake' LIMIT 1), 5, 'Very popular with my dog. This cake is his favorite.'),
(1, (SELECT product_id FROM products WHERE name = 'Liver & Cheese Cake' LIMIT 1), 5, 'My dog gobbled this up so fast! It smells strong, but he loves it.');

-- Reviews for 'Pumpkin Spice Pup Cake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Pumpkin Spice Pup Cake' LIMIT 1), 4, 'A great seasonal treat for my dog. She really enjoyed it.'),
(1, (SELECT product_id FROM products WHERE name = 'Pumpkin Spice Pup Cake' LIMIT 1), 4, 'Looks and smells amazing. A little on the pricey side, but worth it for a special occasion.'),
(1, (SELECT product_id FROM products WHERE name = 'Pumpkin Spice Pup Cake' LIMIT 1), 5, 'It was a hit!');

-- Reviews for 'Vanilla Birthday Cake' (Dog Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Vanilla Birthday Cake' LIMIT 1), 4, 'My dog liked it, a very classic and simple design.');

-- Reviews for 'Chocolate Delight' (Human Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Chocolate Delight' LIMIT 1), 5, 'Absolutely delicious! Rich, moist, and everything you want in a chocolate cake.'),
(1, (SELECT product_id FROM products WHERE name = 'Chocolate Delight' LIMIT 1), 5, 'The best chocolate cake I have ever tasted. It was a crowd pleaser at our party.'),
(1, (SELECT product_id FROM products WHERE name = 'Chocolate Delight' LIMIT 1), 5, 'Moist, decadent, and oh-so-chocolaty. This is a must-buy.'),
(1, (SELECT product_id FROM products WHERE name = 'Chocolate Delight' LIMIT 1), 5, 'I would buy this again and again. Perfect with coffee.'),
(1, (SELECT product_id FROM products WHERE name = 'Chocolate Delight' LIMIT 1), 5, 'This cake is a work of art. The flavor is out of this world!');

-- Reviews for 'Red Velvet Bliss' (Human Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Red Velvet Bliss' LIMIT 1), 5, 'The perfect red velvet cake. The cream cheese frosting is amazing.'),
(1, (SELECT product_id FROM products WHERE name = 'Red Velvet Bliss' LIMIT 1), 5, 'Loved the delicate flavour and texture. It was a great dessert.'),
(1, (SELECT product_id FROM products WHERE name = 'Red Velvet Bliss' LIMIT 1), 5, 'My go-to red velvet cake. Never disappointed.');

-- Reviews for 'Blue Velvet' (Human Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Blue Velvet' LIMIT 1), 5, 'A visual and culinary treat! The blue color is vibrant, and the taste is fantastic.'),
(1, (SELECT product_id FROM products WHERE name = 'Blue Velvet' LIMIT 1), 5, 'Perfect for my son''s birthday party. Everyone loved it.'),
(1, (SELECT product_id FROM products WHERE name = 'Blue Velvet' LIMIT 1), 5, 'The flavour is amazing. I will buy it again!');

-- Reviews for 'Death By Chocolate Cake' (Human Cake)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Death By Chocolate Cake' LIMIT 1), 5, 'If you love chocolate, this is the cake for you. It is so rich and so good.'),
(1, (SELECT product_id FROM products WHERE name = 'Death By Chocolate Cake' LIMIT 1), 5, 'A chocolate lover''s dream. I couldn''t get enough of it!');

-- Reviews for 'Paw Print T-Shirt' (Merch - POD)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND intended_audience = 'POD' LIMIT 1), 5, 'Great quality t-shirt. The print is durable and the material is soft.'),
(1, (SELECT product_id FROM products WHERE name = 'Paw Print T-Shirt' AND intended_audience = 'POD' LIMIT 1), 4, 'Comfy fit and a super cute design. I wear this all the time!');

-- Reviews for 'Pet Lover Mug' (Merch - POD)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Pet Lover Mug' LIMIT 1), 5, 'My new favorite mug! Perfect for my morning coffee.'),
(1, (SELECT product_id FROM products WHERE name = 'Pet Lover Mug' LIMIT 1), 5, 'The mug is a great size and the design is adorable. It arrived quickly and well-packaged.'),
(1, (SELECT product_id FROM products WHERE name = 'Pet Lover Mug' LIMIT 1), 5, 'I love this mug!');

-- Reviews for 'Pet Bandana' (Merch - POD)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Pet Bandana' AND image_url LIKE '%172814aa-b49f-4713-906f-b5f2573c5036.jpg%' LIMIT 1), 5, 'The bandana is high-quality and the adjustable fit is great. My dog looks so stylish now!');

-- Reviews for 'Pet Portrait Pillow' (Merch - POD)
INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES
(1, (SELECT product_id FROM products WHERE name = 'Pet Portrait Pillow' LIMIT 1), 5, 'I bought this as a gift, and they absolutely loved it. The portrait came out perfectly.'),
(1, (SELECT product_id FROM products WHERE name = 'Pet Portrait Pillow' LIMIT 1), 5, 'A great custom gift. The quality is excellent and the image is very clear.');


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

-- POD Merchandise Insert Statements
INSERT INTO products (name, description, category, price, image_url, intended_audience, serves, allergens, is_on_sale) VALUES
('Paw Print T-Shirt', 'Comfortable cotton t-shirt with cute paw print design', 'Apparel', 249.99, 'https://img.kwcdn.com/product/open/00db427a76f44f25a7a114ba4bc3c237-goods.jpeg?imageView2/2/w/800/q/70/format/webp', 'POD', NULL, NULL, TRUE),
('Pet Lover Mug', 'Ceramic mug with "Dog Mom/Dad" text and bone design', 'Home', 149.99, 'https://dogmom.co.za/wp-content/uploads/2022/12/Dog-Mother-Coffee-Lover-Mug-Front-1.jpg.webp', 'POD', NULL, NULL, FALSE),
('Pet Bandana', 'Adjustable cotton bandana for your furry friend', 'Accessories', 99.99, 'https://img.kwcdn.com/product/fancy/172814aa-b49f-4713-906f-b5f2573c5036.jpg?imageView2/2/w/800/q/70/format/webp', 'POD', NULL, NULL, FALSE),
('Pet Portrait Pillow', 'Customizable pillow with your pet\'s portrait', 'Home', 349.99, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQSixsYOxEeffT_pJtXGafl8ZU0hpES0MCrrm1fey_qWW_59ZIF-0CC-9sdfcTnMJdwRtNJYpjZPEDQPR-O2N6DzfdBB0qQ5j6tifsmgJH8nA41qwpfc5GpQBdRIHr12PZLL-ng88GhKg&usqp=CAc', 'POD', NULL, NULL, TRUE),
('Dog Paw Socks', 'Comfy socks with cute dog paw designs', 'Apparel', 129.99, 'https://media.takealot.com/covers_images/01b1057dbeed4a1180e799aaf017ccb5/s-zoom.file', 'POD', NULL, NULL, FALSE),
('Pet Memorial Keychain', 'Beautiful keychain to remember your beloved pet', 'Gifts', 79.99, 'https://d2j6dbq0eux0bg.cloudfront.net/images/49036762/4785369027.jpg', 'POD', NULL, NULL, FALSE),
('Pet Memorial Keychain', 'Beautiful keychain to remember your beloved pet', 'Gifts', 79.99, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQZ3QOI84rNuhFVinX9NZkuXuGpqPK4drPNDl1QJJzRWK9iEZH9ZYsjnBXF57X-hZNVEXLUxTLpBetGhyd4UpjMy2N3qd2f-cw2py5DFITORX0LpUdEXPWNvQ&usqp=CAc', 'POD', NULL, NULL, FALSE),
('Paw Print T-Shirt', 'Comfortable cotton t-shirt with cute paw print design', 'Apparel', 249.99, 'https://img.kwcdn.com/thumbnail/s/836cea6daa36cb4973136ef9fc34d118_547e7d45ef97.jpg?imageView2/2/w/800/q/70/format/webp', 'POD', NULL, NULL, TRUE),
('Pet Bandana', 'Adjustable cotton bandana for your furry friend', 'Accessories', 99.99, 'https://img.ltwebstatic.com/images3_pi/2024/09/02/aa/1725259643dde33bbfa3200390b3dccc145c434aa1_thumbnail_560x.webp', 'POD', NULL, NULL, FALSE);
