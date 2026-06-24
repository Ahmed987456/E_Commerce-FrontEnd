# 🛒 ShopZone — Full Stack E-Commerce

A full-featured e-commerce web application built with **React** (frontend) and **ASP.NET Core 9** (backend).

---

## 🚀 Live Demo

> Coming soon...

---

## 🖥️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS (Dark Mode UI)
- React Router v6
- Zustand (State Management)
- Axios (API calls)

### Backend
- ASP.NET Core 9 Web API
- Entity Framework Core + SQL Server
- JWT Authentication
- AutoMapper
- BCrypt Password Hashing

---

## ✨ Features

### Customer
- 🔐 Register & Login with JWT
- 🛍️ Browse products with category filter & live search
- 📦 View product details
- 🛒 Add to cart / update quantity / remove items
- ✅ Place orders
- 📋 View order history & track status
- ❌ Cancel pending orders

### Admin
- 📦 Add / Edit / Delete products
- 🗂️ Add / Delete categories & subcategories
- 🧾 View all orders & update status
- 👥 Manage users & roles

---

## 📁 Project Structure

```
Frontend (React)          Backend (ASP.NET Core)
├── src/                  ├── Controllers/
│   ├── api/              ├── Services/
│   ├── components/       ├── Models/
│   ├── pages/            ├── Dtos/
│   └── store/            └── Migrations/
```

---

## ⚙️ Setup

### Backend
```bash
# Clone the repo
git clone https://github.com/Ahmed987456/E-Commerce_API

# Update appsettings.json with your connection string
# Run migrations
dotnet ef database update

# Start the server
dotnet run
```

### Frontend
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ecommerce-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:YOUR_PORT/api" > .env

# Start dev server
npm run dev
```

---

## 📸 Screenshots

> Add screenshots here

---

## 👨‍💻 Author

**Ahmed Oraby**
- GitHub: [@Ahmed987456](https://github.com/Ahmed987456)

---

## 📄 License

MIT License