# OIBSIP Web Development & Designing — Task 1: Pizza Delivery Application

A full-stack MERN (MongoDB, Express, React, Node.js) Pizza Delivery Application with a dynamic photo-realistic custom pizza builder, secure authentication, Razorpay payments, and an administrative inventory control system with low-stock alerts.

## 📌 Project Objective
The objective of this project is to build an end-to-end web application that allows users to register securely, customize a pizza with real-time visual feedback, process payments through a test payment gateway, and track order progress. It also provides administrative tools for inventory stock level monitoring, automatic ingredient deduction, and automated email alerts for restocking.

---

## 🛠️ Tools & Technologies Used

### Frontend Stack
*   **Vite + React 19** – Fast, modular UI rendering
*   **React Router v7** – Declarative client-side routing
*   **Axios** – Promise-based HTTP client for API interactions
*   **React Toastify** – Responsive toast notifications
*   **Vanilla CSS** – Highly polished, responsive styling system featuring glassmorphic designs and custom animations

### Backend & Database Stack
*   **Node.js & Express.js** – RESTful API web server framework
*   **MongoDB & Mongoose ODM** – NoSQL database schema definition and data persistence
*   **JSON Web Tokens (JWT) & bcryptjs** – Secure token-based session auth and password hashing
*   **Nodemailer** – SMTP transaction mailing for unverified registrations and admin stock alerts

### Payment Gateway
*   **Razorpay SDK (Test Mode)** – Simulation of digital payment orders and signature verification

---

## 📝 Steps Performed

### 1. Database Model Design & Seeding
*   Designed MongoDB Mongoose schemas for **User** (storing credentials, roles, email verification states), **Order** (storing base/sauce/cheese/toppings breakdowns, status, total cost, and Razorpay IDs), and **Inventory** (tracking quantities, price, and category).
*   Seeded the database with default inventory items (crusts, sauces, cheese varieties, veggies, and meats) and a default administrator account.

### 2. Secure Auth System
*   Implemented registration and login endpoints. Unverified user accounts are blocked until email verification is complete.
*   Secured routing on the frontend via route guards: `ProtectedRoute` restricts access to logged-in users, while `AdminRoute` restricts admin pages.

### 3. Dynamic Custom Pizza Builder (Visual Replica Canvas)
*   Converted the custom builder step timeline into a responsive two-column grid.
*   Integrated a dynamic preview canvas loading transparent overlay PNG layers directly from the original MERN project's Cloudinary storage.
*   Synchronized selections with absolute-position alignments and fade-in keyframes to provide a high-end food-photography rendering of crust base thickness, sauce color, melted cheese, and stacked toppings.

### 4. Checkout & Razorpay Integration
*   Connected the checkout page with the Razorpay API to issue order credentials.
*   Once payment is authorized, the backend verifies the signature, records the order in the database, decrements inventory stock, and checks ingredient thresholds.

### 5. Admin Dashboard & Automated Email Alerts
*   Created overview statistic counters for orders and revenue.
*   Built real-time orders list filters and status selectors (Order Placed → Received → Kitchen → Delivery → Delivered).
*   Configured automated restock alerts that send emails to the administrator if any inventory quantity drops below the safety threshold.

---

## 🎯 Project Outcome (In Brief)
The application successfully delivers a complete MERN stack pizza order and fulfillment pipeline:
1.  **Users** can securely sign up, build their favorite custom pizzas with interactive visual overlays, complete dummy payments, and track order stages in real time.
2.  **Administrators** can track stock volumes, modify inventory quantities, change order statuses, and automatically receive email restock notifications on low stock levels.
3.  The frontend is fully responsive across mobile, tablet, and desktop viewports, styled with a premium modern glassmorphism aesthetic.

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js 18+
*   MongoDB (running locally or via Atlas)

### 1. Server Configuration
1.  Navigate to the server folder:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and paste:
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
4.  Run the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Configuration
1.  Navigate to the client folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the client application:
    ```bash
    npm run dev
    ```
4.  Open **[http://localhost:5173](http://localhost:5173)** to access the app.

### 🔑 Seed Credentials
*   **Admin Email**: `admin@pizza.com`
*   **Admin Password**: `Admin@123`
