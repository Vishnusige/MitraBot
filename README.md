# 🧠 MitraBot – Your Mental Health Companion

MitraBot is a compassionate AI-powered mental health chatbot designed to offer support, self-care tools, and a safe conversational space. Built with full-stack technologies, MitraBot leverages modern web frameworks, databases, and AI integrations to deliver accessible emotional assistance for individuals without easy access to mental health professionals.

---

## 🌟 Features

- 💬 **Interactive Chatbot Interface** – Conversational UI with natural language understanding.
- 🧘 **Mental Health Tools** – Includes daily check-ins, mood tracking, journaling, and grounding exercises.
- 🛠️ **Admin Dashboard** – Monitor and manage user activity and chatbot content.
- 📚 **Resource Center** – Curated content for self-help, therapy exercises, and crisis support.
- 🔐 **User Authentication** – Secure user login and session management.
- 📊 **Personal Insights** – User mood trends and progress tracking over time.

---

## 🚀 Tech Stack

**Frontend**:
- React.js
- Tailwind CSS / Bootstrap
- Axios

**Backend**:
- Flask (for Chatbot APIs)
- Django (for Admin panel & user authentication)
- PostgreSQL
- Django Rest Framework (DRF)
- JWT Auth

**AI & NLP**:
- DialoGPT and tuned Gemini model (custom AI companion)
- Emotion & sentiment analysis module

**DevOps & Infra**:
- Docker
- GitHub Actions

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/praneethattada/MitraBot.git
cd MitraBot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Make sure your backend is running on a port (e.g., `localhost:8000`) that your frontend (typically on `localhost:3000`) can access.

---



## 🔮 Future Improvements

- Voice-based chatbot interaction
- Integration with wearable devices
- Gamified self-care challenges
- Offline mode with local storage fallback
- Panic button with emergency numbers

---

## 🤝 Contributing

Pull requests are welcome!

1. Fork the repo
2. Create your feature branch:  
   `git checkout -b feature/YourFeature`
3. Commit your changes:  
   `git commit -m 'Add your feature'`
4. Push to the branch:  
   `git push origin feature/YourFeature`
5. Open a Pull Request


---

## 🙏 Acknowledgements

- OpenAI & HuggingFace for language models
- Developers and mental health professionals who inspired and supported this

---

> 💙 _MitraBot is not a replacement for professional mental health care, but a companion that listens and supports._ If you or someone you know is in crisis, please seek help from professionals or contact emergency services.
