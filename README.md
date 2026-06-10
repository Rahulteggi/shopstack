# 🛍️ ShopStack — Full Stack E-Commerce Platform

A fully functional e-commerce platform built with React, Node.js, Express, and MongoDB.

![ShopStack Demo](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80)

## ✨ Features

- **Product Catalog** — Browse 12+ products with search, category filters, and sorting
- **Product Reviews** — Star ratings and customer reviews with averages
- **Shopping Cart** — Persistent cart with quantity controls and free shipping calculator
- **Checkout Flow** — Shipping address form with order summary
- **Order History** — Track all past orders with status timeline (Pending → Shipped → Delivered)
- **Order Detail** — Full order breakdown with payment summary
- **Admin Panel** — Add/delete products, view inventory stats
- **JWT Authentication** — Register, login, protected routes

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Vite, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free M0 tier works)

### 1. Clone the repo
```bash
git clone https://github.com/Rahulteggi/shopstack.git
cd shopstack
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Seed the Database
```bash
node src/seed.js
# Seeds 12 sample products
```

### 4. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

Open **http://localhost:5173**

## 📁 Project Structure

```
shopstack/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios API client
│       ├── components/     # Navbar, ProductCard
│       ├── context/        # Auth + Cart context
│       └── pages/          # Home, Cart, Checkout, Orders...
└── server/                 # Express backend
    └── src/
        ├── models/         # User, Product, Order schemas
        ├── routes/         # auth, products, orders
        └── seed.js         # Database seeder
```

## 🔑 Environment Variables

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=8080
```

## 📸 Screenshots

- **Home**: Product grid with search, category filters, and sort
- **Cart**: Persistent cart with free shipping threshold
- **Checkout**: Shipping form with order summary
- **Orders**: Order history with status tracker

## 👤 Author

**Rahul Teggi** — [github.com/Rahulteggi](https://github.com/Rahulteggi)
