# Tweety

A Twitter clone where users can sign up and log in securely, post tweets, like and comment on posts, follow and unfollow users and more.

## Tech Stack

- **Frontend**: React, TanStack React Query, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Language**: Typescript

## Setting it up locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DevastatorDev/tweety.git
   cd tweety
   ```

2. **Set up environment variables**:

- Copy `.env.example` in the `backend` folder and rename it to `.env`
- Fill in the required values:

  ```ini
  PORT=3000
  DB_URI="your_mongodb_uri"
  JWT_SECRET="your_secret_key"
  NODE_ENV="development"
  CLOUDINARY_CLOUD_NAME="your_cloud_name"
  CLOUDINARY_API_KEY="your_api_key"
  CLOUDINARY_API_SECRET="your_api_secret"
  ```

3. **Install dependencies**:

   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

4. **Start the development servers**:
   - **Backend**:
     ```bash
     cd backend
     npm run dev
     ```
   - **Frontend**:
     ```bash
     cd ../frontend
     npm run dev
     ```
