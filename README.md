# PolicyLens: AI-Powered Insurance Policy Management System

## Overview

PolicyLens is an AI-powered application designed to simplify the understanding and management of insurance policies.  It provides a user-friendly interface for:

- **Policy Summarization:** Transforms lengthy insurance documents into clear, concise summaries.
- **Multilingual Support:**  Breaks down language barriers by providing translations in multiple regional languages.
- **AI Chatbot:**  Offers instant answers to policy-related questions through an intelligent chatbot.

## Architecture 

The system architecture follows a MERN (MongoDB, Express.js, React.js, Node.js) stack pattern with a strong emphasis on AI integration.

![image](https://github.com/user-attachments/assets/46098d66-3894-43d8-ab5c-e1be37c34021)


## Features

- **User Authentication and Authorization:**
   - Secure user registration and login (`/client/src/pages/SignIn.jsx`, `/client/src/pages/SignUp.jsx`)
   - JWT (JSON Web Token) based authentication (`/server/src/middlewares/authUserMiddleware.js`)

- **Document Processing:**
   - Upload and storage of insurance policy documents (PDF format) (`/server/src/middlewares/multerMiddleware.js`)
   - AI-powered extraction of key terms and conditions  (`/server/src/controllers/geminiController.js`)
   - Generation of concise and easy-to-understand summaries (`/server/src/controllers/summaryController.js`)

- **Multilingual Support:**
   - On-demand translation of policy summaries into multiple regional languages (`/server/src/controllers/regionalLanguageController.js`)

- **AI Chatbot Integration:**
   - Interactive chatbot interface (`/client/src/pages/ChatBot.jsx`)
   - Context-aware responses using Retrieval Augmented Generation (RAG) for personalized assistance (`/server/src/controllers/messageController.js`)

- **User Profile Management:** 
   - Create, view, and update user profiles (`/client/src/pages/Profile.jsx`)
   - Secure storage of user data (`/server/src/models/userModel.js`)

- **Policy Management (Future Feature):**
   - Planned features for users to manage their insurance policies within the application

## Technologies Used

- **Frontend:**
  - React.js
  - Redux (for state management)
  - HTML, CSS, JavaScript

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MongoDB

- **AI Integration:**
  - Google Gemini API 

- **Cloud Storage:**
  - Cloudinary 

## Screenshots
**Home Page**
![image](https://github.com/user-attachments/assets/5c28e4de-1bdc-4e1c-ba17-39c6ba54ad06)
**Sign Up page**
![image](https://github.com/user-attachments/assets/c60ee03f-b765-495b-a203-153f24e00c37)
**Sign In page**
![image](https://github.com/user-attachments/assets/e681f51c-0000-46d5-8a05-79ff8c37ba2c)
**Policy Summary Generator page for creating concise policy overviews**
![image](https://github.com/user-attachments/assets/5b6d3135-7da3-4665-b199-eb81a0a09eb1)
**Policy Summary Page generated using the provided policy PDF**
![image](https://github.com/user-attachments/assets/932499e4-4ed8-4e92-9e19-a700bd868d49)
**Translation of the summary into the user's preferred native language for better understanding**
![image](https://github.com/user-attachments/assets/218db882-1127-49d0-ad22-f4f8eaf87725)
**English text translated into regional languages to improve accessibility and user experience**
![image](https://github.com/user-attachments/assets/42fa600f-6255-4044-91e6-7a23c01e4c56)
**Initiating a new chat with query recommendations tailored to the user's context**
![image](https://github.com/user-attachments/assets/47ad2d83-8d4c-4e49-a426-b0ff4e612caa)
**User interacting with the chatbot for assistance and query resolution**
![image](https://github.com/user-attachments/assets/cd977919-75fb-4c83-8e27-9fe8e95ee770)
**Updating user profile details to provide better context and personalization**
![image](https://github.com/user-attachments/assets/b509d012-58a4-466f-ba3f-5557106ef037)
**Updating the user password by verifying the old password for security**
![image](https://github.com/user-attachments/assets/019f8a03-d409-4464-b633-206f7599667b)
**Including an insurance policy on the personalized dashboard for easy access and management**
![image](https://github.com/user-attachments/assets/0921419f-eb64-48d4-b9d9-35f431c98575)
**Dashboard displaying a list of user-added insurance policies for convenient tracking and management**
![image](https://github.com/user-attachments/assets/0a6c86f6-8538-4338-91f0-af4f0f12281e)


## Getting Started

### Prerequisites:

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- MongoDB (ensure you have a running MongoDB instance)

### Installation & Setup:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PolicyLens.git 
   cd PolicyLens
2. **Install server-side dependencies:**
   ```bash
   cd server
   npm install
3. **Install client-side dependencies:**
   ```bash
   cd client 
   npm install
4. **Configuration:**
  - Create a .env file in the server directory.
  - Add the following environment variables to the .env file, replacing the placeholders with your actual credentials:
     ```bash
    MONGODB_URI=your-mongodb-connection-string
    GEMINI_API_KEY=your-gemini-api-key
    CLOUDINARY_URL=your-cloudinary-url
    ACCESS_TOKEN_SECRET_KEY=your-access-token-secret-key
    REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret-key
    CORS_ORIGIN=http://localhost:5173
5. **Run the application:**
    ```bash
    # Start the development servers
    cd server && npm run dev 
    cd client && npm run dev
6. Access the application:
Open your web browser and navigate to http://localhost:5173 (or your defined frontend port) to access PolicyLens.


## Future EnhancementsAdvanced Policy Comparisons:
- Allow users to compare different insurance policies side-by-side.
- Automated Claim Assistance:  Guide users through the claims process with AI-powered assistance.
- Integration with Insurance Providers: Enable seamless policy management and claims filing within the platform.


















