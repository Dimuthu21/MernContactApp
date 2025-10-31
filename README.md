# 🌐 MERN Contact Management System

A **full-stack MERN (MongoDB, Express, React, Node.js)** application that allows users to manage contacts with full **CRUD (Create, Read, Update, Delete)** functionality.

The system includes dynamic country management, form validations, and a user-friendly interface connected to **MongoDB Atlas**.

---

## 📸 Application UI

![Application UI](./ss/UI.png)

---

## 📁 Project Folder Structure

MernContactApp/
│
├── backend/ # Node.js + Express + MongoDB backend
│ ├── controllers/ # Handles business logic
│ ├── models/ # Database schemas (Mongoose)
│ ├── routes/ # API routes for Countries & Contacts
│ ├── server.js # Entry point for the backend
│ ├── package.json # Backend dependencies
│ └── .env # Environment variables (Mongo URI)
│
├── frontend/ # React frontend (user interface)
│ ├── src/
│ │ ├── api/ # Axios API calls
│ │ ├── components/ # React components (Form, List)
│ │ ├── App.js # Main app file
│ │ ├── App.css # Styling
│ │ └── index.js # React entry point
│ ├── public/
│ └── package.json # Frontend dependencies
│
└── ss/ # Screenshots and media
└── UI.png

yaml
Copy code

---

## ⚙️ Technologies Used

### 🖥️ Frontend
- React.js
- Axios
- HTML5 / CSS3
- JavaScript (ES6)

### ⚙️ Backend
- Node.js
- Express.js
- Mongoose
- dotenv
- CORS
- MongoDB Atlas (Cloud Database)

---

## 🚀 Features

✅ Add, update, and delete contacts  
✅ Inline validation for required fields  
✅ Supports multiple phone numbers (Home, Work, Alternate)  
✅ Add new countries dynamically from the form  
✅ Live country dropdown from MongoDB Atlas  
✅ Responsive, modern UI built with React  

---

## 🧩 Environment Variables

Create a `.env` file in the **backend** folder with:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

yaml
Copy code

---

## 🧭 How to Run the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/MernContactApp.git
cd MernContactApp
2️⃣ Start the Backend
bash
Copy code
cd backend
npm install
npx nodemon server.js
Backend runs on: http://localhost:5000

3️⃣ Start the Frontend
Open another terminal:

bash
Copy code
cd frontend
npm install
npm start
Frontend runs on: http://localhost:3000

🧪 Testing via Postman
Method	Endpoint	Description
GET	/api/countries	Fetch all countries
POST	/api/countries	Add a new country
GET	/api/contacts	Fetch all contacts
POST	/api/contacts	Add a new contact
PUT	/api/contacts/:id	Update contact
DELETE	/api/contacts/:id	Delete contact

🧠 Developer
Name: Dimuthu Shalinda
University: University of Jaffna – Faculty of Engineering
Department: Computer Engineering

