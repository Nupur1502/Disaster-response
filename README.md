# 🌍 Disaster Response Coordination Platform

A full-stack web application built to coordinate disaster response efforts by collecting, analyzing, and visualizing real-time disaster-related data.

---

## 🚀 Live Demo

- *Frontend (Vercel)*: [https://disaster-response-pink.vercel.app](https://disaster-response-pink.vercel.app)  
- *Backend (Render)*: [https://disaster-response-gebm.onrender.com](https://disaster-response-gebm.onrender.com)

---

## 🧩 Tech Stack

- *Frontend*: React + Vite + CSS  
- *Backend*: Node.js + Express.js  
- *Database*: Supabase (PostgreSQL)  
- *WebSockets*: Socket.IO  
- *Geocoding*: OpenStreetMap Nominatim API  
- *Image/Location Analysis*: Dummy Google Gemini API (mocked for testing)  

---

## 📦 Features

- ✅ Submit and update disasters with tags, descriptions, and geolocation.
- ✅ Extract location names and convert them to coordinates.
- ✅ Real-time disaster list updates via WebSockets.
- ✅ Submit and verify reports with image links.
- ✅ View geospatially mapped nearby resources using Supabase geography queries.
- ✅ Dark mode toggle.
- ✅ Caching of external API responses in Supabase.
- ✅ Structured logging and error handling.

---

## 🧪 External Services Used

- 🔹 *Supabase* – for storing disasters, reports, resources, and cache.
- 🔹 *Socket.IO* – real-time updates when disasters/reports are created.
- 🔹 *OpenStreetMap Nominatim API* – geocoding locations to lat/lon.
- 🔹 *Google Gemini API (Dummy)* –  
   ➤ Due to billing restrictions, a mocked/dummy Gemini API was used for:
   - Location extraction from descriptions.
   - Image verification (simulated logic used for testing).

---

## 📁 Project Structure
Disaster-response/
├── backend/                # Express.js server with REST API + WebSocket
│   ├── routes/             # All API route handlers
│   ├── utils/              # Helper functions (e.g., geocoding, Gemini mock)
│   ├── server.js           # Entry point for backend server
│   └── .env                # Supabase credentials and config
│
├── frontend/               # React + Vite frontend for disaster UI
│   ├── App.jsx             # Main UI logic
│   ├── index.css           # Basic styling and dark mode support
│   └── main.jsx            # Entry point for React
│
└── README.md               # This file

---

🛠️ Setup Instructions

🔹 Backend Setup (Render)

cd backend  
npm install  
node index.js  
  
Make sure to add the following environment variables:  
  
SUPABASE_URL  
  
SUPABASE_KEY  
  
  
These are required for Supabase integration.  
  
  
---  
  
🔹 Frontend Setup (Vercel)  
  
cd frontend  
npm install  
npm run dev  
  
You can deploy the frontend via Vercel. No environment variables are needed for frontend.  
  
  
---  
  
📌 Notes  
  
🔐 Gemini API was not used directly due to billing constraints.  
  
A dummy Gemini integration was implemented for:  
  
Location extraction  
  
Image verification  
  
  
  
💡 Project was focused on backend logic and real-time features, as per assignment instructions.  
  
  
  
---  
  
🎯 Assignment Checklist  
  
[x] Disaster CRUD + ownership  
  
[x] Geolocation extraction + conversion  
  
[x] Supabase geospatial queries  
  
[x] Image verification (dummy)  
  
[x] WebSocket real-time updates  
  
[x] Reports + resources submission  
  
[x] Caching using Supabase  
  
[x] Frontend UI (minimal + dark mode)  
  
[x] Deployment on Vercel + Render  
  
  
  
---  
  
🙌 Made With  
  
💻 Cursor & ChatGPT (for fast prototyping)  
  
⚡ Vite + React  
  
🌐 Express.js + Supabase  
  
🧪 Dummy Gemini Logic  
  
🔍 OpenStreetMap Nominatim API  
  
  
  
---  
  
