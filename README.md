# 🤖 AI Interview Preparation Platform

An AI-powered full-stack interview preparation platform that helps users practice technical and HR interviews based on their resume. Users can upload their resume, generate AI-based interview questions, complete mock interviews, receive AI-generated feedback, and track their interview performance through an analytics dashboard.

---

## 🚀 Live Demo

### Frontend
https://ai-interview-preparation-platform-khaki.vercel.app/

### Backend API
https://ai-interview-preparation-platform-c2am.onrender.com

---

## ✨ Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login

### Resume Management
- Upload Resume (PDF)
- Replace Existing Resume
- PDF Text Extraction
- Resume Storage

### AI Interview
- Resume-Based Question Generation
- Category Selection
- Difficulty Selection
- AI Mock Interview
- Save Answers
- Complete Interview

### AI Evaluation
- AI Score Generation
- Strengths Analysis
- Weakness Analysis
- Suggestions
- Overall Feedback

### Dashboard
- Performance Analytics
- Interview History
- Score Comparison
- Search Interviews
- Filter by Category
- Filter by Difficulty
- Pagination
- Reattempt Interviews

### Reports
- Export Interview Report as PDF

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Context API
- Axios
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Multer
- PDF Parse
- PDFKit

### AI
- OpenRouter API

### Deployment
- Vercel
- Render

---

## 📂 Folder Structure

```
AI Interview/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── package.json
│
└── README.md
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/kartikeyvarshney12/AI-Interview-Preparation-Platform.git
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URL=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY

CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Resume

- POST /api/resume/upload
- PUT /api/resume/replace

### Interview

- POST /api/interviews/start
- PUT /api/interviews/answer
- PUT /api/interviews/complete
- GET /api/interviews/history
- POST /api/interviews/reattempt

### Analytics

- GET /api/interviews/analytics

### Reports

- GET /api/reports/:id

---

## 📈 Future Improvements

- Email Notifications
- AI Voice Interview
- Video Interview
- Cloud Storage Integration
- Interview Scheduling
- Admin Dashboard
- Company-wise Interview Sets

---

## 📸 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- Upload Resume
- Mock Interview
- AI Feedback
- Analytics Dashboard

---

## 👨‍💻 Author

**Kartikey Varshney**
GitHub: https://github.com/kartikeyvarshney12

LinkedIn: https://www.linkedin.com/in/kartikeyvarshney18?utm_source=share_via&utm_content=profile&utm_medium=member_android
