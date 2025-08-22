# Cake4Days E-Commerce Website

Welcome to Cake4Days! This is a full-stack e-commerce platform for ordering cakes and treats.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Nodemailer Setup](#nodemailer-setup)
- [License](#license)

---

## Project Structure

```
e-commerce_cake4days/
  backend/    # Node.js/Express API
  frontend/   # Vue.js SPA
```

---

## Features

- User authentication & profiles
- Product catalogue & search
- Shopping cart & wishlist
- Order placement & custom orders
- Admin dashboard
- Payment integration

---

## Getting Started

### Backend Setup

1. **Navigate to backend folder:**
   ```
   cd backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and secret keys. See [Environment Variables](#environment-variables) below.

4. **Start backend server:**
   ```
   npm start
   ```
   The backend runs on [http://localhost:5000](http://localhost:5000) by default.

---

### Frontend Setup

1. **Navigate to frontend folder:**
   ```
   cd frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run serve
   ```
   The frontend runs on [http://localhost:8080](http://localhost:8080) by default.

---

## Dependencies

### Backend

- express
- cors
- dotenv
- mysql2
- bcryptjs
- jsonwebtoken
- nodemailer
- (see `backend/package.json` for full list)

### Frontend

- vue
- vue-router
- vuex
- axios
- (see `frontend/package.json` for full list)

---

## Usage

1. Start the backend server.
2. Start the frontend server.
3. Open your browser and go to [http://localhost:8080](http://localhost:8080).
4. Register or sign in to start shopping!

---

## Configuration

- **Backend:** Edit `.env` for database, JWT, and email configuration.
- **Frontend:** Edit `src/assets/index.css` and other Vue components for customization.

---

## Environment Variables

Create a `.env` file in the `backend` folder with the following content (replace values as needed):

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email@example.com
```

- `DB_*`: Your MySQL database credentials.
- `JWT_SECRET`: Secret key for JWT authentication.
- `EMAIL_*`: Credentials for your email service (used by Nodemailer).

---

## Nodemailer Setup

To enable email features (like password reset, order confirmations):

1. Use a real SMTP provider (e.g., Gmail, Outlook, SendGrid, Mailtrap for testing).
2. Fill in the `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` in your `.env` file.
   - For Gmail, you may need to enable "App Passwords" or "Less secure app access".
   - Example for Gmail:
     ```
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=yourgmail@gmail.com
     EMAIL_PASS=your_gmail_app_password
     EMAIL_FROM=yourgmail@gmail.com
     ```
3. Restart your backend server after editing `.env`.

---

## License

MIT

---

For more details, see the individual `README.md` files 