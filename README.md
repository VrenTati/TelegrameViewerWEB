# Telegram Frontend

This repository contains the frontend application for managing Telegram chats. The project is built using **Next.js** and provides an intuitive interface for viewing chats and messages, as well as managing user connections to Telegram.

## Features

- **User Authentication**: Secure login/logout functionality.
- **Telegram Integration**: Connect your Telegram account and view your chats and messages.
- **Chat Interface**: Navigate through your chats and view messages in real time.

## Prerequisites

- **Node.js**: Version 14 or higher
- **npm** or **yarn**: For managing dependencies
- A running backend service compatible with the frontend. (See [Backend Repository]([#](https://github.com/VrenTati/TelegramViewerAPI)) for more details.)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/VrenTati/TelegrameViewerWEB.git
cd TelegrameViewerWEB
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and configure the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 4. Run the Development Server

```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

## Key Pages

### `/` (Home)
- User authentication page for logging in.

### `/connect`
- Connect your Telegram account by entering your phone number and verification code.

### `/chats`
- View your Telegram chats and messages.

## Scripts

- `dev`: Start the development server.
- `build`: Build the application for production.
- `start`: Start the production server.
- `lint`: Run ESLint to check for code issues.

## API Endpoints

The frontend interacts with the backend using the following API endpoints:

- **`POST /auth/register`**: Register a new user.
- **`POST /auth/login`**: Log in a user and retrieve a token.
- **`GET /telegram/chats`**: Fetch user chats.
- **`GET /telegram/messages`**: Fetch messages for a specific chat.
- **`POST /telegram/logout`**: Disconnect Telegram account.
- **`POST /auth/logout`**: Logout from account.


