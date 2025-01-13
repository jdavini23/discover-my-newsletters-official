# Discover My Newsletters - MVP

## Project Overview

Discover My Newsletters is an innovative platform designed to help users discover and curate newsletter subscriptions tailored to their interests.

## 🚀 Features

- **Personalized Newsletter Recommendations**
- **User Authentication**
- **Interest-based Filtering**
- **Interactive Discovery**

## 🛠 Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: Zustand
- **Routing**: React Router
- **Backend**: Firebase
  - Authentication
  - Firestore
- **Styling**: Tailwind CSS

## 📦 Prerequisites

- Node.js (v18+)
- npm (v9+)
- Firebase Account

## 🔧 Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/discover-my-newsletters.git
cd discover-my-newsletters
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Create a `.env.local` file in the project root
3. Add your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Seed Initial Data (Optional)
```bash
npm run seed
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📊 Project Structure
```
src/
├── components/
│   ├── common/
│   ├── auth/
│   └── discovery/
├── pages/
├── hooks/
├── stores/
├── services/
├── utils/
└── types/
```

## 🧪 Testing
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🎉 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy Newsletter Discovering! 📰✨**
