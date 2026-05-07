# MediQuery: AI Medical Knowledge Assistant

## Visit Live Website : https://medicaichatbotfrontend.vercel.app
## Backend repository: https://github.com/darshankardil-create/medic_ai_chat_bot_backend

**MediQuery** is a sophisticated, AI-driven medical chat application built with **Next.js**. It leverages RAG (Retrieval-Augmented Generation) against a medical encyclopedia to provide users with accurate, concise, and reliable medical information.

---

### This LLM currently uses the Gale Encyclopedia of Medicine as a core information source to answer medical-related queries. It's built as a plug-and-play system, allowing users to integrate any custom data source they prefer. Once the data is provided, the model is ready to serve accurate, domain-specific answers with a simple npm run seed command.

---

## 🚀 Key Features

* **AI Medical Consultations:** Real-time chat powered by **Socket.io** for instant answers to complex medical questions.
* **Chat Persistence:** Seamlessly save and resume conversations with an automated history tracking system.
* **Secure Authentication:** JWT-based login and registration system with credential-protected account deletion.
* **Sleek UI/UX:** A modern, dark-themed interface built with **Tailwind CSS**, featuring responsive sidebars and fluid animations.
* **Account Management:** Dedicated panel to view account details and manage personal data.

---

## 🛠️ Project Structure

The application follows a modular React component architecture:

```text
└── ./
    ├── app
    │   ├── src
    │   │   ├── components
    │   │   │   ├── accountpannel.jsx   # User settings & account deletion
    │   │   │   ├── authform.jsx        # Login/Signup forms & logic
    │   │   │   ├── chathistory.jsx     # Sidebar listing of past chats
    │   │   │   ├── chatinterface.jsx   # Main chat logic & Socket integration
    │   │   │   ├── confirmation.jsx    # Reusable delete/sign-out dialogs
    │   │   │   ├── icons.jsx           # SVG Icon library
    │   │   │   ├── message.jsx         # Chat bubble components
    │   │   │   ├── root.jsx            # Main app entry/wrapper
    │   │   │   ├── toaskhook.jsx       # Custom hook for notifications
    │   │   │   ├── toast.jsx           # UI Toast notification component
    │   │   │   └── typedetect.jsx      # AI typing animation
    │   │   └── lib
    │   │       └── basepath.jsx        # API & Socket config
    │   ├── globals.css                 # Global styles & Tailwind imports
    │   ├── layout.tsx                  # Next.js root layout
    │   └── page.jsx                    # Main entry point page
    └── next.config.ts                  # Next.js configuration

```

---

## 💻 Tech Stack (frontend)

* **Framework:** Next.js (App Router)
* **Real-time:** Socket.io-client
* **Styling:** Tailwind CSS + DaisyUI
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
* **Networking:** Axios (for REST) + Socket.io (for streaming)
* **Formatting:** Day.js (Date/Time manipulation)

## Tech Stack (Backend)

- **Backend Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **AI Embeddings:** Hugging Face Inference API (`BAAI/bge-large-en-v1.5`)
- **Text Generation:** OpenAI-compatible model (`openai/gpt-oss-120b:fastest`)
- **Rate Limiting:** Upstash Redis + Upstash Ratelimit
- **Real-Time Communication:** Socket.IO
- **Environment Variables:** dotenv
- **PDF Processing:** pdf-parse-new
- **Text Splitting:** LangChain RecursiveCharacterTextSplitter

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/darshankardil-create/medic_ai_chat_bot_frontend
cd mediquery

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure API Endpoints:**
Update your API base URL in `./app/src/lib/basepath.jsx`:


    export const API_BASE = "https://your-backend-api.com";
    

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## API Endpoints

### Authentication
- `POST /signin` → Register user
- `POST /login` → Login user
- `GET /gettokenpayload` → Validate JWT token
- `GET /getmyaccinfo/:id` → Get account info

### Chat Management
- `POST /savechats` → Save chat history
- `GET /getmyallchats/:username` → Get all chats
- `PUT /updatechathistory/:id` → Update chat
- `DELETE /deletechat/:id` → Delete single chat
- `DELETE /deleteacandchats/:id/:username` → Delete account + chats

---

## Auto-Save Mechanism

The **MediQuery** auto-save system uses a `useEffect` hook to silently sync conversations to **MongoDB** in real-time. The first message triggers a **POST** request to initialize the session, while all subsequent messages use **PUT** requests to append data to the existing record. By utilizing a `useRef` to track session IDs and sanitizing payloads to a simple `{ type, content }` format, the system prevents duplicate entries and ensures high performance. This background process allows users to refresh or switch devices without losing progress, while integrated rate-limit protection ensures the sync remains stable and secure.

---

## 🛡️ Usage Policy

> **Disclaimer:** MediQuery is an AI-powered tool designed for educational and reference purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.

---

## 🔒 Security Features

*   **Credential Verification:** Deleting an account requires re-authentication to prevent unauthorized data loss.
*   **Protected Storage:** Tokens are stored in `localStorage` for session persistence.
*   **Rate Limiting:** Built-in handling for `429 Too Many Requests` to ensure API stability.

---
*Developed with a focus on medical clarity and user privacy.*




