# Project Bolt

Project Bolt is a **React + TypeScript + Vite** web application featuring authentication, protected routes, and a dynamic UI built with Tailwind CSS. It integrates API services and utilizes Firebase for authentication.

## Features
- Authentication system with protected routes
- React Router for navigation
- Tailwind CSS for styling
- API integration for dynamic data fetching
- State management using React Context API

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/project-bolt.git
   cd project-bolt
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required API keys and configurations:
     ```env
     VITE_API_BASE_URL=https://api.example.com
     VITE_FIREBASE_API_KEY=your-firebase-api-key
     VITE_AUTH_DOMAIN=your-auth-domain
     ```

### Running the Project
To start the development server:
```sh
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:5173/`.

## API Integration
This project integrates with an external API for fetching user data. The API base URL is stored in the `.env` file and can be accessed via:

```ts
const API_URL = import.meta.env.VITE_API_BASE_URL;
fetch(`${API_URL}/users`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## Authentication
Authentication is managed using Firebase. The authentication context is implemented in `AuthContext.tsx`, which provides user state and login/logout functions.

Example usage:
```tsx
import { useAuth } from '@/context/AuthContext';
const { user, login, logout } = useAuth();
```

## Deployment
To build the project for production:
```sh
npm run build
# or
yarn build
```
Then deploy the `dist/` folder to a hosting service like Vercel or Netlify.

## License
This project is open-source and available under the [MIT License](LICENSE).

