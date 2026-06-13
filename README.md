# 🍕 Pizza Delivery Application — OIBSIP Web Development & Designing Level 3

A full-stack **MERN** (MongoDB, Express, React, Node.js) Pizza Delivery Application featuring a dynamic photo-realistic custom pizza builder, secure authentication, Razorpay payments, and an administrative inventory control system with automated low-stock email alerts.

---

## 📌 Project Objective

Build an end-to-end web application that allows users to:
- Register securely and verify their email
- Customize a pizza with real-time visual feedback
- Process payments through a test payment gateway (Razorpay)
- Track order progress in real time

Administrators get tools for inventory stock monitoring, automatic ingredient deduction, and automated email alerts for restocking.

---

## 🛠️ Tools & Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| Vite + React 19 | Fast, modular UI rendering |
| React Router v7 | Declarative client-side routing |
| Axios | Promise-based HTTP client for API interactions |
| React Toastify | Responsive toast notifications |
| Vanilla CSS | Glassmorphic designs, animations, responsive styling |

### Backend & Database
| Technology | Purpose |
|---|---|
| Node.js & Express.js | RESTful API web server framework |
| MongoDB & Mongoose | NoSQL database schema definition and data persistence |
| JWT & bcryptjs | Secure token-based session auth and password hashing |
| Nodemailer | SMTP email for verification and admin stock alerts |

### Payment Gateway
| Technology | Purpose |
|---|---|
| Razorpay SDK (Test Mode) | Simulation of digital payment orders and signature verification |

---

## 📝 Steps Performed

### 1. Database Model Design & Seeding
- Designed MongoDB Mongoose schemas for **User** (credentials, roles, email verification), **Order** (base/sauce/cheese/toppings, status, cost, Razorpay IDs), and **Inventory** (quantities, price, category).
- Seeded the database with default inventory items (crusts, sauces, cheese varieties, veggies, meats) and a default admin account.

### 2. Secure Auth System
- Implemented registration and login endpoints with email verification — unverified accounts are blocked until verified.
- Frontend route guards: `ProtectedRoute` restricts logged-in access; `AdminRoute` restricts admin-only pages.

### 3. Dynamic Custom Pizza Builder
- Converted the builder into a responsive two-column step timeline grid.
- Integrated a dynamic preview canvas loading transparent overlay PNG layers from Cloudinary storage.
- Synchronized selections with absolute-position alignments and fade-in keyframes for a high-end food-photography render of crust, sauce, cheese, and toppings.

### 4. Checkout & Razorpay Integration
- Connected the checkout page with the Razorpay API to issue order credentials.
- On successful payment, the backend verifies the signature, records the order, decrements inventory stock, and checks ingredient thresholds.

### 5. Admin Dashboard & Automated Email Alerts
- Overview statistic counters for total orders and revenue.
- Real-time orders list with status selectors: `Order Placed → Received → Kitchen → Delivery → Delivered`.
- Automated restock alert emails sent to the administrator when inventory drops below the safety threshold.

---

## 🎯 Project Outcome

The application delivers a complete MERN stack pizza order and fulfillment pipeline:

- **Users** can sign up securely, build custom pizzas with interactive visual overlays, complete dummy payments, and track orders in real time.
- **Administrators** can monitor stock volumes, modify inventory quantities, update order statuses, and receive automated low-stock email alerts.
- The frontend is fully responsive across mobile, tablet, and desktop, styled with a premium glassmorphism aesthetic.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB (running locally or via MongoDB Atlas)

---

### 1. Server Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizza-delivery
JWT_SECRET=your-secret-jwt-key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_password
ADMIN_EMAIL=admin@pizza.com
CLIENT_URL=http://localhost:5173
STOCK_THRESHOLD=20
```

Start the server:

```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@pizza.com | Admin@123 |

---

## 📁 Project Structure

```
internship_task_3/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/          # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── README.md
```

---

## 🙌 Acknowledgements

This project was built as part of the **OIBSIP (Oasis Infobyte Summer Internship Program)** — Web Development & Designing Track, Task 1.
